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
    >
      <motion.p className={s.eyebrow} variants={fadeUp}>
        四柱命理 · Four Pillars of Destiny
      </motion.p>

      <motion.h1 className={s.heading} variants={fadeUp}>
        Discover your destiny through{' '}
        <span className={s.headingAccent}>Korean astrology</span>
      </motion.h1>

      <motion.p className={s.subtitle} variants={fadeUp}>
        Saju reveals your elemental nature using the Four Pillars — an ancient system that reads the cosmic energy of your birth.
      </motion.p>

      <motion.form
        className={s.formCard}
        onSubmit={handleSubmit(onSubmit)}
        variants={fadeUp}
      >
        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Name</label>
          <input className={s.fieldInput} placeholder="Your name" autoComplete="off" {...register('name')} />
          {errors.name && <p className={s.fieldError}>{errors.name.message}</p>}
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>Date of birth</label>
          <input type="date" className={s.fieldInput} {...register('birthDate')} />
          {errors.birthDate && <p className={s.fieldError}>{errors.birthDate.message}</p>}
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel}>
            Time of birth <span className={s.fieldOptional}>(optional)</span>
          </label>
          <input type="time" className={s.fieldInput} {...register('birthTime')} />
        </div>

        <button type="submit" className={s.submitButton} disabled={isLoading}>
          {isLoading ? 'Reading your chart…' : 'Reveal my destiny'}
        </button>
      </motion.form>

      <motion.p className={s.footnote} variants={fadeUp}>
        Your data is never stored or shared.
      </motion.p>
    </motion.section>
  );
}
