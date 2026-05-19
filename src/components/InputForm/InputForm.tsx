'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './InputForm.css';

const MIN_BIRTH_YEAR = 1900;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const TODAY_ISO = TODAY.toISOString().slice(0, 10);

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function pad2(value: string | undefined): string {
  if (!value) return '';
  return value.padStart(2, '0');
}

/* Block characters that <input type="number"> still allows by default
   (e/E for exponent, +/- for sign, . for decimal). Digits, navigation, and
   ctrl/cmd shortcuts pass through. */
const ALLOWED_NON_DIGIT_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

function blockNonNumericKey(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (e.metaKey || e.ctrlKey) return; // allow copy/paste/select-all
  if (ALLOWED_NON_DIGIT_KEYS.has(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

/* Reject paste contents that aren't purely digits. */
function blockNonNumericPaste(e: React.ClipboardEvent<HTMLInputElement>): void {
  const text = e.clipboardData.getData('text');
  if (!/^\d+$/.test(text)) e.preventDefault();
}

/* Split year/month/day/hour/minute keep the inputs locale-neutral (English
   only, no browser native date picker that follows OS locale). Schema
   validates each part and assembles into birthDate / birthTime on submit. */
const schema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    birthMonth: z.string().min(1, 'Month is required'),
    birthDay: z.string().min(1, 'Day is required'),
    birthYear: z
      .string()
      .min(1, 'Year is required')
      .regex(/^\d{4}$/, 'Year must be 4 digits'),
    birthHour: z.string().optional(),
    birthMinute: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const year = Number(data.birthYear);
    const month = Number(data.birthMonth);
    const day = Number(data.birthDay);

    if (year < MIN_BIRTH_YEAR || year > CURRENT_YEAR) {
      ctx.addIssue({
        code: 'custom',
        path: ['birthYear'],
        message: `Year must be between ${MIN_BIRTH_YEAR} and ${CURRENT_YEAR}`,
      });
      return;
    }

    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthDay'],
          message: 'Please enter a valid date',
        });
        return;
      }

      const iso = `${data.birthYear}-${pad2(data.birthMonth)}-${pad2(data.birthDay)}`;
      if (iso > TODAY_ISO) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthYear'],
          message: "Birth date can't be in the future",
        });
        return;
      }
    }

    if (data.birthHour && data.birthHour !== '') {
      const h = Number(data.birthHour);
      if (!Number.isFinite(h) || h < 0 || h > 23) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthHour'],
          message: 'Hour must be 0–23',
        });
      }
    }
    if (data.birthMinute && data.birthMinute !== '') {
      const m = Number(data.birthMinute);
      if (!Number.isFinite(m) || m < 0 || m > 59) {
        ctx.addIssue({
          code: 'custom',
          path: ['birthMinute'],
          message: 'Minute must be 0–59',
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

type NumericField = 'birthYear' | 'birthHour' | 'birthMinute';

export function InputForm() {
  const { setInput, fetchSaju, isLoadingChart } = useSajuStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      birthHour: '',
      birthMinute: '',
    },
  });

  /* Real-time clamp for the numeric fields. Strips non-digits (defense
     against assistive tech that bypasses onKeyDown/onPaste), enforces a
     max length so users can't type "9999" for a minute, and clamps the
     numeric value to the upper bound so out-of-range values self-correct
     as the user types. setValue keeps RHF state in sync with the DOM. */
  const clampNumeric = (field: NumericField, max: number, maxLen: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > maxLen) val = val.slice(0, maxLen);
      if (val !== '' && Number(val) > max) val = String(max);
      if (val !== e.target.value) {
        e.target.value = val;
        setValue(field, val, { shouldValidate: false });
      }
    };

  const onSubmit = async (data: FormData) => {
    const birthDate = `${data.birthYear}-${pad2(data.birthMonth)}-${pad2(data.birthDay)}`;
    const birthTime =
      data.birthHour && data.birthHour !== ''
        ? `${pad2(data.birthHour)}:${pad2(data.birthMinute || '0')}`
        : null;
    setInput(data.name, birthDate, birthTime);
    await fetchSaju();
  };

  /* Surface the first date-related error in priority order. Layout-wise the
     date row hosts three controls; a single message under them is cleaner
     than per-input messages. */
  const dateError =
    errors.birthMonth?.message ||
    errors.birthDay?.message ||
    errors.birthYear?.message;

  const timeError = errors.birthHour?.message || errors.birthMinute?.message;

  return (
    <motion.section
      className={s.section}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      aria-labelledby="saju-heading"
    >
      <motion.header className={s.heroHeader} variants={fadeUp}>
        <p className={s.eyebrow}>四柱命理 · Four Pillars of Destiny</p>

        <h1 id="saju-heading" className={s.heading}>
          Discover your destiny through{' '}
          <span className={s.headingAccent}>Korean astrology</span>
        </h1>

        <p className={s.subtitle}>
          Saju reveals your elemental nature using the Four Pillars — an ancient
          system that reads the cosmic energy of your birth.
        </p>
      </motion.header>

      <motion.form
        className={s.formCard}
        onSubmit={handleSubmit(onSubmit)}
        variants={fadeUp}
        noValidate
      >
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            <span className={s.fieldLabelText}>Name</span>
            <input
              className={s.fieldInput}
              placeholder="Your name"
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              {...register('name')}
            />
          </label>
          {errors.name && (
            <p className={s.fieldError} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <fieldset className={s.fieldset}>
          <legend className={s.fieldLabelText}>Date of birth</legend>
          <div className={s.dateRow}>
            <select
              className={s.fieldSelect}
              aria-label="Month"
              aria-invalid={errors.birthMonth ? true : undefined}
              {...register('birthMonth')}
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              className={s.fieldSelect}
              aria-label="Day"
              aria-invalid={errors.birthDay ? true : undefined}
              {...register('birthDay')}
            >
              <option value="">Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {Number(d)}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="numeric"
              step={1}
              className={s.fieldInput}
              placeholder="Year"
              aria-label="Year"
              min={MIN_BIRTH_YEAR}
              max={CURRENT_YEAR}
              onKeyDown={blockNonNumericKey}
              onPaste={blockNonNumericPaste}
              aria-invalid={errors.birthYear ? true : undefined}
              {...register('birthYear', {
                onChange: clampNumeric('birthYear', CURRENT_YEAR, 4),
              })}
            />
          </div>
          {dateError && (
            <p className={s.fieldError} role="alert">
              {dateError}
            </p>
          )}
        </fieldset>

        <fieldset className={s.fieldset}>
          <legend className={s.fieldLabelText}>
            Time of birth <span className={s.fieldOptional}>(optional, 24-hour)</span>
          </legend>
          <div className={s.timeRow}>
            <input
              type="number"
              inputMode="numeric"
              step={1}
              className={s.fieldInput}
              placeholder="HH"
              aria-label="Hour"
              min={0}
              max={23}
              onKeyDown={blockNonNumericKey}
              onPaste={blockNonNumericPaste}
              aria-invalid={errors.birthHour ? true : undefined}
              {...register('birthHour', {
                onChange: clampNumeric('birthHour', 23, 2),
              })}
            />
            <span className={s.timeColon} aria-hidden="true">:</span>
            <input
              type="number"
              inputMode="numeric"
              step={1}
              className={s.fieldInput}
              placeholder="MM"
              aria-label="Minute"
              min={0}
              max={59}
              onKeyDown={blockNonNumericKey}
              onPaste={blockNonNumericPaste}
              aria-invalid={errors.birthMinute ? true : undefined}
              {...register('birthMinute', {
                onChange: clampNumeric('birthMinute', 59, 2),
              })}
            />
          </div>
          {timeError && (
            <p className={s.fieldError} role="alert">
              {timeError}
            </p>
          )}
        </fieldset>

        <button type="submit" className={s.submitButton} disabled={isLoadingChart}>
          {isLoadingChart ? 'Reading your chart…' : 'Reveal my destiny'}
        </button>
      </motion.form>

      <motion.small className={s.footnote} variants={fadeUp}>
        Your data is never stored or shared.
      </motion.small>
    </motion.section>
  );
}
