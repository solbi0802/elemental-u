'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './InputForm.css';

const schema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  birthDate: z.string().min(1, 'Please select your date of birth'),
  birthTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function InputForm() {
  const { setInput, fetchSaju, isLoading } = useSajuStore();

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

        <button type="submit" className={s.submitButton} disabled={isLoading}>
          {isLoading ? 'Reading your chart…' : 'Reveal my destiny'}
        </button>
      </motion.form>

      <motion.small className={s.footnote} variants={fadeUp}>
        Your data is never stored or shared.
      </motion.small>
    </motion.section>
  );
}
