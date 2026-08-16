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

## أوامر

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | سيرفر التطوير |
| `npm run build` | بناء نسخة الإنتاج في `dist/` |
| `npm run preview` | معاينة نسخة الإنتاج |
| `npm run lint` | فحص الكود بـ oxlint |
