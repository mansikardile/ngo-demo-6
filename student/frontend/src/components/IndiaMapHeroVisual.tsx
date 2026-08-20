'use client';

import React from 'react';
import { Sparkles, Award, ShieldCheck, Laptop, Heart } from 'lucide-react';

export default function IndiaMapHeroVisual() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto flex items-center justify-center select-none py-6">
      {/* Ambient background decorative dots / confetti */}
      <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-amber-500/80 shadow-lg animate-bounce duration-1000" />
      <div className="absolute top-1/4 -left-2 w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-md" />
      <div className="absolute bottom-16 left-12 w-3.5 h-3.5 rounded-full bg-sky-500/80 shadow-md animate-pulse" />
      <div className="absolute top-12 right-2 w-3 h-3 rounded-full bg-rose-500/80 shadow-md animate-bounce" />
      <div className="absolute bottom-28 -right-3 w-2.5 h-2.5 rounded-full bg-indigo-500/80 shadow-md" />
      <div className="absolute top-1/2 -right-4 w-4 h-4 rounded-full bg-amber-400/80 shadow-md" />
      <div className="absolute bottom-6 right-20 w-3 h-3 rounded-full bg-emerald-400/80 shadow-md animate-pulse" />

      {/* Subtle Glow Behind India Map */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/20 via-rose-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main SVG Container with India Map Contour Mask */}
      <div className="relative w-full aspect-[6/7] max-h-[520px] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]">
        <svg
          viewBox="0 0 600 700"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Detailed India Geographic Silhouette Mask */}
            <clipPath id="india-map-silhouette">
              <path d="
                M 295 18
                C 310 15, 328 25, 340 40
                C 355 58, 365 72, 380 90
                C 392 108, 375 125, 365 142
                C 358 152, 370 165, 385 175
                C 400 185, 415 190, 430 195
                C 442 192, 452 188, 460 196
                C 468 204, 462 215, 475 218
                C 490 220, 510 205, 528 190
                C 545 178, 560 185, 575 198
                C 590 215, 585 238, 572 255
                C 560 270, 542 278, 525 285
                C 505 292, 488 280, 475 272
                C 462 265, 455 280, 452 295
                C 448 315, 458 335, 452 355
                C 445 380, 430 405, 415 430
                C 398 458, 382 485, 368 515
                C 352 550, 338 585, 322 620
                C 312 642, 302 665, 292 685
                C 285 688, 278 680, 274 668
                C 265 640, 252 612, 245 580
                C 238 550, 242 522, 232 490
                C 222 460, 208 432, 198 402
                C 188 375, 175 352, 155 342
                C 135 332, 108 340, 85 348
                C 65 355, 48 340, 52 322
                C 56 305, 78 295, 98 290
                C 120 285, 142 295, 160 275
                C 175 258, 172 235, 178 212
                C 185 188, 198 165, 212 142
                C 225 120, 238 98, 252 75
                C 265 52, 280 22, 295 18
                Z
              " />
            </clipPath>

            {/* Subtle Inner Glow / Border Gradient */}
            <linearGradient id="map-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e11d48" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background Shadow Outline */}
          <path
            d="
              M 295 18
              C 310 15, 328 25, 340 40
              C 355 58, 365 72, 380 90
              C 392 108, 375 125, 365 142
              C 358 152, 370 165, 385 175
              C 400 185, 415 190, 430 195
              C 442 192, 452 188, 460 196
              C 468 204, 462 215, 475 218
              C 490 220, 510 205, 528 190
              C 545 178, 560 185, 575 198
              C 590 215, 585 238, 572 255
              C 560 270, 542 278, 525 285
              C 505 292, 488 280, 475 272
              C 462 265, 455 280, 452 295
              C 448 315, 458 335, 452 355
              C 445 380, 430 405, 415 430
              C 398 458, 382 485, 368 515
              C 352 550, 338 585, 322 620
              C 312 642, 302 665, 292 685
              C 285 688, 278 680, 274 668
              C 265 640, 252 612, 245 580
              C 238 550, 242 522, 232 490
              C 222 460, 208 432, 198 402
              C 188 375, 175 352, 155 342
              C 135 332, 108 340, 85 348
              C 65 355, 48 340, 52 322
              C 56 305, 78 295, 98 290
              C 120 285, 142 295, 160 275
              C 175 258, 172 235, 178 212
              C 185 188, 198 165, 212 142
              C 225 120, 238 98, 252 75
              C 265 52, 280 22, 295 18
              Z
            "
            fill="#f8fafc"
            stroke="url(#map-border-grad)"
            strokeWidth="3"
            className="filter drop-shadow-xl"
          />

          {/* Masked Photo of Young Indian Women Engineering Scholars */}
          <g clipPath="url(#india-map-silhouette)">
            <image
              href="/images/indian_scholars_hero.jpg"
              x="20"
              y="0"
              width="560"
              height="700"
              preserveAspectRatio="xMidYMid slice"
              className="hover:scale-105 transition-transform duration-700 origin-center"
            />
            {/* Subtle Warm Overlay for Depth */}
            <rect
              x="0"
              y="0"
              width="600"
              height="700"
              fill="url(#overlay-grad)"
              style={{ mixBlendMode: 'soft-light' }}
            />
          </g>

          <defs>
            <linearGradient id="overlay-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#000" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Decorative Contour Line Stroke on Top */}
          <path
            d="
              M 295 18
              C 310 15, 328 25, 340 40
              C 355 58, 365 72, 380 90
              C 392 108, 375 125, 365 142
              C 358 152, 370 165, 385 175
              C 400 185, 415 190, 430 195
              C 442 192, 452 188, 460 196
              C 468 204, 462 215, 475 218
              C 490 220, 510 205, 528 190
              C 545 178, 560 185, 575 198
              C 590 215, 585 238, 572 255
              C 560 270, 542 278, 525 285
              C 505 292, 488 280, 475 272
              C 462 265, 455 280, 452 295
              C 448 315, 458 335, 452 355
              C 445 380, 430 405, 415 430
              C 398 458, 382 485, 368 515
              C 352 550, 338 585, 322 620
              C 312 642, 302 665, 292 685
              C 285 688, 278 680, 274 668
              C 265 640, 252 612, 245 580
              C 238 550, 242 522, 232 490
              C 222 460, 208 432, 198 402
              C 188 375, 175 352, 155 342
              C 135 332, 108 340, 85 348
              C 65 355, 48 340, 52 322
              C 56 305, 78 295, 98 290
              C 120 285, 142 295, 160 275
              C 175 258, 172 235, 178 212
              C 185 188, 198 165, 212 142
              C 225 120, 238 98, 252 75
              C 265 52, 280 22, 295 18
              Z
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeOpacity="0.9"
          />
        </svg>
      </div>

      {/* Floating Badge 1: 100% Laptop Grant */}
      <div className="absolute top-8 -left-4 sm:-left-6 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl max-w-[200px] animate-float z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Laptop className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">100% Free Laptops</p>
            <p className="text-[9px] text-slate-500 font-medium">Brand-new coding devices</p>
          </div>
        </div>
      </div>

      {/* Floating Badge 2: 4,500+ Scholars */}
      <div className="absolute bottom-10 -right-2 sm:-right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl max-w-[210px] animate-float-delayed z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">4,500+ STEM Scholars</p>
            <p className="text-[9px] text-slate-500 font-medium">Pan-India Fellowship reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
