# 사용자가 진행할 수동 작업

코드는 다 들어왔으니 이제 외부 서비스 셋업 + key 채워 넣기만 하시면 됩니다.

---

## 1. Supabase

1. [supabase.com](https://supabase.com) 가입 → 새 프로젝트
2. **SQL Editor** 에서 `supabase/migrations/0001_purchases.sql` 복붙 실행
3. **Settings → API** 에서:
   - **Project URL** → `.env.local` 의 `SUPABASE_URL`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ **anon key 아님** 주의 — service_role 만 서버 라우트에서 사용)

---

## 2. Lemon Squeezy

1. [lemonsqueezy.com](https://lemonsqueezy.com) 가입 (**개인 계정 OK, 사업자 X**)
2. **Store** 생성
3. **Product** 생성: "Elemental-U Complete Reading", **$2.99**
   - 생성 후 variant URL 에서 **Variant ID** 확인 → `LEMONSQUEEZY_VARIANT_ID`
4. **Settings → API** → key 발급 → `LEMONSQUEEZY_API_KEY`
5. **Store overview** 에서 **Store ID** 확인 → `LEMONSQUEEZY_STORE_ID`
6. 로컬 테스트용 webhook:
   - `ngrok http 3000` 실행
   - LS **Settings → Webhooks** → 새 webhook 추가
     - URL: `https://<ngrok>.ngrok-free.app/api/payment/webhook`
     - Event: `order_created`
   - signing secret 받아서 → `LEMONSQUEEZY_WEBHOOK_SECRET`

---

## 3. `.env.local` 채우기

`.env.example` 복사해서 `.env.local` 만들고 값 채우기:

```bash
cp .env.example .env.local
```

```dotenv
GEMINI_API_KEY=...
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_VARIANT_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000    # 로컬
# NEXT_PUBLIC_SITE_URL=https://elemental-u.vercel.app   # 배포 후 prod URL
```

---

## 4. 로컬 테스트

1. dev 서버 **재시작** (`.env.local` 은 자동 reload 안 됨)
2. http://localhost:3000 접속
3. 생년월일 입력 → 차트 표시
4. Paywall **"Get complete destiny — $2.99"** 클릭
5. LS test card 로 결제:
   - 카드: `4242 4242 4242 4242`
   - 만료일: 미래 임의 (예: `12/30`)
   - CVC: 임의 3자리
6. 결제 완료 → 우리 도메인으로 리다이렉트 → SajuLoader → 6 ReadingCards 표시

---

## 5. Vercel 배포

1. GitHub push → Vercel 에서 repo import
2. **Project Settings → Environment Variables** 에 위 6개 변수 동일하게 추가
3. `NEXT_PUBLIC_SITE_URL` 만 Vercel 도메인으로 변경
4. LS 대시보드의 webhook URL 도 Vercel 도메인으로 업데이트
   (`https://elemental-u.vercel.app/api/payment/webhook`)
5. 실제 결제 받을 때만 LS **test → live mode** 전환
   (live key + variant 재발급 필요할 수 있음)

---

## 참고

- **dev bypass 모드**: `LEMONSQUEEZY_*` env 비워두면 결제 우회. 클릭 시 즉시 Gemini 가 readings 생성하고 unlock 됨. 결제 통합 전 UI/UX 테스트용.
- **Supabase 없이도 동작**: `SUPABASE_*` 비워두면 in-memory only. 결과는 새로고침 시 사라지고, 카드는 `/card/preview?n=&d=&t=` 흐름으로 동작.
- **Gemini free tier 한도**: image generation 은 일 ~5회 제한. text (readings) 는 더 넉넉. text 만 쓰면 거의 무료.
