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

## منصة الطالب (Supabase)

صفحات `/login` و`/signup` و`/platform` بتشتغل على [Supabase](https://supabase.com):
تسجيل بالإيميل والباسورد، وقاعدة بيانات فيها الطالب وكورساته. الحساب بتاع الطالب؛ اسم ورقم
ولي الأمر بيتسجّلوا معاه عشان المدرسة تتواصل معاه لو فيه تأخير أو ملاحظات. فيه كمان
`/forgot-password` و`/reset-password` لاسترجاع الباسورد بلينك على الإيميل.

### الإعداد لأول مرة

1. من لوحة Supabase → **Project Settings → API Keys** خد الـ Project URL والـ publishable key
   وضيفهم في `.env`:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   ماتحطش أبدًا أي مفتاح `sb_secret_` أو `service_role` في الموقع.

2. **SQL Editor** → query جديدة → الصق محتوى [`supabase/schema.sql`](supabase/schema.sql) → Run.
   ده بيعمل الجداول (`students`, `enrollments`)، وسياسات الـ RLS اللي بتخلي كل طالب يشوف
   بياناته بس، والـ trigger اللي بينقل بيانات فورم التسجيل لجدول الطلاب.

3. **Authentication → Sign In / Providers → Email**: خليه مفعّل، واقفل **Confirm email** مؤقتًا.
   من غير كده Supabase بيبعت لينك تأكيد قبل أول دخول، والإيميلات الافتراضية محدودة جدًا
   (شوف تحت). رجّعه بعد ما تظبط SMTP.

4. **Authentication → URL Configuration**: حط Site URL على `https://sc-school.com` وضيف في
   Redirect URLs:

   ```
   http://localhost:5173/**
   https://sc-school.com/**
   ```

   لينك استرجاع الباسورد بيرجّع الطالب على `/reset-password`، ولازم الدومين يكون في القايمة دي.

### لوحة التحكم (`/admin`)

الكورسات والدروس وتسجيل الطلاب بتتدار من `/admin` على الموقع نفسه، مش من لوحة Supabase.

1. شغّل [`supabase/002_admin_courses_lessons.sql`](supabase/002_admin_courses_lessons.sql) مرة
   واحدة في SQL Editor (بعد `schema.sql`). بيعمل جداول `admins` و`courses` و`lessons`
   و`lesson_files`، وبيعيد بناء `enrollments` عشان تشاور على كورس حقيقي، وبيعمل bucket
   اسمه `lesson-files` لملفات الدروس.
2. أول أدمن بتعمله بإيدك: في آخر نفس الملف فيه ٣ سطور `insert into public.admins` معلّقة.
   حط إيميل الحساب اللي سجّلت بيه على الموقع مكان `you@example.com`، شيل الـ `--`، وشغّلهم.
3. ادخل بالحساب ده وهتلاقي زرار **لوحة التحكم** في الـ Navbar.

في اللوحة:

- **الكورسات**: إضافة كورس، ترتيبه، نشره أو إخفاؤه. جوه الكورس: الدروس (عنوان + لينك YouTube
  + شرح + ملفات مرفقة لحد ٢٥ MB)، وتسجيل الطلاب في الكورس وتغيير حالتهم.
- **الطلاب**: كل المسجّلين مع بيانات ولي الأمر، وبحث، وصفحة لكل طالب فيها كورساته.

الطالب مش بيشوف غير الكورسات المنشورة اللي هو مسجّل فيها، والدروس المنشورة منها. ده مفروض
من قاعدة البيانات (RLS) مش من الواجهة بس.

على جهة الطالب: `/platform` بيعرض كورساته، `/platform/courses/:id` بيعرض دروس الكورس، و
`/platform/courses/:id/lessons/:lessonId` بيعرض الدرس نفسه: فيديو YouTube، الشرح، والملفات
المرفقة. الملفات بتتحمّل بلينك موقّع صلاحيته دقيقتين، فمش بينفع يتبعت لحد برّه المنصة.

فيديوهات الدروس بتتحط على YouTube (عادي أو Unlisted) والموقع بيعرضها باللينك.

### قبل ما فيه عيلات حقيقية تستخدمها

الإيميلات (تأكيد الحساب واسترجاع الباسورد) بتطلع من SMTP بتاع Supabase الافتراضي، وده محدود
بكام إيميل في الساعة وللتجربة بس، وقوالب الإيميل مقفولة للتعديل على المشاريع المجانية الجديدة
لحد ما تظبط SMTP خاص. وصّل SMTP خاص (Brevo أو Resend مثلًا) من **Project Settings →
Authentication → SMTP Settings**، وبعدها تقدر تعرّب القوالب وترجّع **Confirm email**.

عند النشر على Vercel ضيف `VITE_SUPABASE_URL` و`VITE_SUPABASE_PUBLISHABLE_KEY` في Environment
Variables بتاعة المشروع.

## أوامر

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | سيرفر التطوير |
| `npm run build` | بناء نسخة الإنتاج في `dist/` |
| `npm run preview` | معاينة نسخة الإنتاج |
| `npm run lint` | فحص الكود بـ oxlint |
