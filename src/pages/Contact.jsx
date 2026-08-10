export default function Contact() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">تواصل معنا</h1>
      <p className="text-gray-600 text-center mb-8">هنرد عليك في أقرب وقت</p>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="الاسم"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="رسالتك"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          إرسال
        </button>
      </form>
    </div>
  )
}
