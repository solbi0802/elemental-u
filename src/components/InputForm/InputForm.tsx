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

const schema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  birthDate: z
    .string()
    .min(1, 'Please select your date of birth')
    .superRefine((val, ctx) => {
      /* Strict ISO format with a 4-digit year — guards against browsers that
         accept 5+ digit year input via direct keyboard typing. */
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        ctx.addIssue({ code: 'custom', message: 'Please enter a valid date (YYYY-MM-DD)' });
        return;
      }
      const [year, month, day] = val.split('-').map(Number);

      if (year < MIN_BIRTH_YEAR || year > CURRENT_YEAR) {
        ctx.addIssue({
          code: 'custom',
          message: `Year must be between ${MIN_BIRTH_YEAR} and ${CURRENT_YEAR}`,
        });
        return;
      }

      if (month < 1 || month > 12) {
        ctx.addIssue({ code: 'custom', message: 'Month must be between 01 and 12' });
        return;
      }

      if (day < 1 || day > 31) {
        ctx.addIssue({ code: 'custom', message: 'Day must be between 01 and 31' });
        return;
      }

      /* Reject impossible calendar dates like 2024-02-30 or 2024-04-31 */
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        ctx.addIssue({ code: 'custom', message: 'Please enter a valid date' });
        return;
      }

      /* Catch the edge case where year/month/day are individually valid but
         the full date lands in the future (e.g. 2026-12-31 when today is
         2026-05-19). */
      if (val > TODAY_ISO) {
        ctx.addIssue({ code: 'custom', message: "Birth date can't be in the future" });
      }
    }),
  birthTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function InputForm() {
  const { setInput, fetchSaju, isLoadingChart } = useSajuStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setInput(data.name, data.birthDate, data.birthTime || null);
    await fetchSaju();
  };

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
          {errors.name && <p className={s.fieldError} role="alert">{errors.name.message}</p>}
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            <span className={s.fieldLabelText}>Date of birth</span>
            <input
              type="date"
              className={s.fieldInput}
              min={`${MIN_BIRTH_YEAR}-01-01`}
              max={TODAY_ISO}
              aria-invalid={errors.birthDate ? true : undefined}
              {...register('birthDate')}
            />
          </label>
          {errors.birthDate && <p className={s.fieldError} role="alert">{errors.birthDate.message}</p>}
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            <span className={s.fieldLabelText}>
              Time of birth <span className={s.fieldOptional}>(optional)</span>
            </span>
            <input type="time" className={s.fieldInput} {...register('birthTime')} />
          </label>
        </div>

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
