# SC-School

موقع Smart Core School — React + Vite + Tailwind.

## التشغيل

```bash
npm install
npm run dev
```

## فورم التواصل

صفحة `/contact` بتبعت البيانات لـ [Web3Forms](https://web3forms.com)، فمحتاجة access key
عشان تشتغل:

1. ادخل [web3forms.com](https://web3forms.com) واكتب الإيميل اللي عايز يستقبل الطلبات.
2. هيوصلك access key على نفس الإيميل.
3. انسخ `.env.example` لملف اسمه `.env` وحط المفتاح فيه:

   ```
   VITE_WEB3FORMS_ACCESS_KEY=your-key-here
   ```

4. شغّل السيرفر من تاني — Vite بيقرا ملفات `.env` عند البدء بس.

من غير المفتاح الفورم بيوقف الإرسال وبيعرض رسالة خطأ للزائر (مش هيدّي نجاح كداب).
ملف `.env` متجاهل في git؛ `.env.example` هو اللي بيتبعت.

عند النشر (Netlify / Vercel / GitHub Pages) لازم تضيف نفس المتغير في إعدادات البيئة
بتاعة المنصة، لأن `.env` مش موجود في الريبو.

## منصة ولي الأمر (Supabase)

صفحات `/login` و`/signup` و`/platform` بتشتغل على [Supabase](https://supabase.com):
تسجيل بكود على الإيميل من غير باسورد، وقاعدة بيانات فيها ولي الأمر والطالب والكورسات.

### الإعداد لأول مرة

1. من لوحة Supabase → **Project Settings → API Keys** خد الـ Project URL والـ publishable key
   وضيفهم في `.env`:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   ماتحطش أبدًا أي مفتاح `sb_secret_` أو `service_role` في الموقع.

2. **SQL Editor** → query جديدة → الصق محتوى [`supabase/schema.sql`](supabase/schema.sql) → Run.
   ده بيعمل الجداول (`profiles`, `students`, `enrollments`)، وسياسات الـ RLS اللي بتخلي كل
   ولي أمر يشوف بياناته بس، والـ trigger اللي بينقل بيانات فورم التسجيل للجداول.

3. **Authentication → Email Templates**: في قالب *Magic Link* وقالب *Confirm signup* استبدل
   `{{ .ConfirmationURL }}` بـ `{{ .Token }}` عشان الإيميل يوصل فيه كود من ٦ أرقام بدل لينك.
   مثال:

   ```
   كود الدخول لمنصة Smart Core School هو: {{ .Token }}
   ```

4. **Authentication → Providers → Email**: خليه مفعّل. مش محتاج Redirect URLs لأن الدخول
   بالكود مابيعملش redirect.

### إضافة كورس لطالب

الموقع مابيسمحش لولي الأمر يضيف كورسات؛ ده بيتم من لوحة Supabase → **Table Editor →
enrollments**: اختار `student_id` وبعدين اكتب `course` و`level` و`schedule` و`starts_on`.
`status` واحدة من `active` / `completed` / `paused`.

### قبل ما فيه عيلات حقيقية تستخدمها

الإيميلات بتطلع من SMTP بتاع Supabase الافتراضي، وده محدود بكام إيميل في الساعة وللتجربة بس.
وصّل SMTP خاص (Resend أو Brevo مثلًا) من **Project Settings → Authentication → SMTP Settings**.

عند النشر على Vercel ضيف `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` في Environment
Variables بتاعة المشروع.

## أوامر

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | سيرفر التطوير |
| `npm run build` | بناء نسخة الإنتاج في `dist/` |
| `npm run preview` | معاينة نسخة الإنتاج |
| `npm run lint` | فحص الكود بـ oxlint |
