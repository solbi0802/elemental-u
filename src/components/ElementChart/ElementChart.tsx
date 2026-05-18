'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { ElementBalance, Element, FourPillars } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import { STEM_NAMES, BRANCH_NAMES } from '@/lib/saju/constants';
import { ElementNode } from '@/components/ElementNode/ElementNode';
import { fadeUp, staggerContainer, scaleIn } from '@/styles/animations';
import * as s from './ElementChart.css';

interface Props {
  balance: ElementBalance;
  dominantElement: Element;
  dayMaster: Element;
  fourPillars: FourPillars;
  name: string;
}

const NODES: { element: Element; cx: number; cy: number }[] = [
  { element: 'fire',  cx: 260, cy: 50 },
  { element: 'earth', cx: 415, cy: 170 },
  { element: 'metal', cx: 360, cy: 355 },
  { element: 'water', cx: 160, cy: 355 },
  { element: 'wood',  cx: 105, cy: 170 },
];

const SANG_SAENG: [number, number][] = [[4,0],[0,1],[1,2],[2,3],[3,4]];
const SANG_GEUK: [number, number][] = [[4,1],[0,2],[1,3],[2,4],[3,0]];

function arc(x1: number, y1: number, x2: number, y2: number, bend: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  return `M${x1},${y1} Q${mx + (-dy / len) * bend},${my + (dx / len) * bend} ${x2},${y2}`;
}

const PILLAR_NAMES = ['Year', 'Month', 'Day', 'Hour'] as const;

export function ElementChart({ balance, dominantElement, dayMaster, fourPillars, name }: Props) {
  const dm = ELEMENT_META[dayMaster];
  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate tooltip position in % relative to chartWrap
  const hoveredNode = hoveredElement ? NODES.find(n => n.element === hoveredElement) : null;
  const hoveredMeta = hoveredElement ? ELEMENT_META[hoveredElement] : null;

  // SVG viewBox is 520x440, tooltip positioned relative to that
  const tipLeft = hoveredNode ? `${(hoveredNode.cx / 520) * 100}%` : '0';
  // Place above the node (cy - offset), mapped to container %
  const isTopHalf = hoveredNode ? hoveredNode.cy < 220 : false;
  const tipTop = hoveredNode
    ? isTopHalf
      ? `${((hoveredNode.cy + 80) / 440) * 100}%`  // below node if in top half
      : `${((hoveredNode.cy - 120) / 440) * 100}%`  // above node if in bottom half
    : '0';

  return (
    <motion.div
      className={s.outer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <div className={s.colorBlock}>
        <motion.p className={s.eyebrow} variants={fadeUp}>FIVE ELEMENTS · FREE</motion.p>
        <motion.h2 className={s.title} variants={fadeUp}>
          {name}&apos;s elemental chart
        </motion.h2>

        <motion.div className={s.masterCard} variants={fadeUp}>
          <span className={s.masterLabel}>Day Master</span>
          <span className={s.masterValue} style={{ color: dm.color }}>
            {dm.emoji} {dm.label} — {dm.archetype}
          </span>
        </motion.div>

        <motion.div className={s.chartWrap} variants={scaleIn} ref={chartRef}>
          <svg viewBox="0 0 520 440" className={s.svg}>
            <defs>
              <marker id="a-g" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#3aa15c" />
              </marker>
              <marker id="a-c" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill="#f15b46" opacity="0.6" />
              </marker>
              <filter id="gold-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <polygon
              points={NODES.map(n => `${n.cx},${n.cy}`).join(' ')}
              fill="none" stroke="rgba(212, 168, 87, 0.12)" strokeWidth={1}
            />

            {SANG_SAENG.map(([f, t]) => (
              <path key={`ss-${f}${t}`}
                d={arc(NODES[f].cx, NODES[f].cy, NODES[t].cx, NODES[t].cy, -15)}
                fill="none" stroke="#3aa15c" strokeWidth={1.2}
                markerEnd="url(#a-g)" opacity={0.55}
              />
            ))}

            {SANG_GEUK.map(([f, t]) => (
              <line key={`sg-${f}${t}`}
                x1={NODES[f].cx} y1={NODES[f].cy}
                x2={NODES[t].cx} y2={NODES[t].cy}
                stroke="#f15b46" strokeWidth={1} strokeDasharray="4,4"
                markerEnd="url(#a-c)" opacity={0.3}
              />
            ))}

            {NODES.map(({ element, cx, cy }) => (
              <ElementNode key={element}
                element={element} percentage={balance[element]}
                cx={cx} cy={cy} isDominant={element === dominantElement}
                isHovered={hoveredElement === element}
                onHover={setHoveredElement}
              />
            ))}
          </svg>

          {/* HTML tooltip — above SVG, no overlap */}
          {hoveredElement && hoveredMeta && (
            <div
              className={s.tooltip}
              style={{ left: tipLeft, top: tipTop }}
            >
              <div className={s.tooltipTitle} style={{ color: hoveredMeta.color }}>
                {hoveredMeta.emoji} {hoveredMeta.label}
              </div>
              <div className={s.tooltipArchetype}>{hoveredMeta.archetype}</div>
              <div className={s.traitRow}>
                {hoveredMeta.traits.map(t => (
                  <span key={t} className={s.trait}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div className={s.legend} variants={fadeUp}>
          <div className={s.legendItem}>
            <svg width="22" height="2"><line x1="0" y1="1" x2="22" y2="1" stroke="#3aa15c" strokeWidth="1.5" /></svg>
            Generates · 相生
          </div>
          <div className={s.legendItem}>
            <svg width="22" height="2"><line x1="0" y1="1" x2="22" y2="1" stroke="#f15b46" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.7" /></svg>
            Controls · 相剋
          </div>
        </motion.div>

        <motion.div className={s.pillarsWrap} variants={fadeUp}>
          <div className={s.pillarsLabel}>FOUR PILLARS · 四柱</div>
          <div className={s.pillarsRow}>
            {pillars.map((p, i) => {
              if (!p) return null;
              const sc = ELEMENT_META[p.stemElement].color;
              const bc = ELEMENT_META[p.branchElement].color;
              return (
                <div key={PILLAR_NAMES[i]} className={s.pillarCard}>
                  <div className={s.pillarTitle}>{PILLAR_NAMES[i]}</div>
                  <div className={s.pillarHanja} style={{ color: sc }}>{p.stem}</div>
                  <div className={s.pillarSub} style={{ color: bc }}>{p.branch}</div>
                  <div className={s.pillarRomanji}>
                    {STEM_NAMES[p.stem].split(' ')[0]}·{BRANCH_NAMES[p.branch].split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
