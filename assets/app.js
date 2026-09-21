'use strict';
(() => {
  const form = document.getElementById('service-form');
  const submit = document.getElementById('submit-button');
  const error = document.getElementById('error');
  const success = document.getElementById('success');
  const fields = document.getElementById('form-fields');
  let busy = false;
  document.getElementById('year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
    if (!success.hidden) reset();
    document.getElementById('plan').value = button.dataset.plan;
    document.getElementById('request').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }));
  function reset() {
    form.reset(); success.hidden = true; fields.hidden = false; error.hidden = true;
    document.getElementById('name').focus();
  }
  document.getElementById('new-request').addEventListener('click', reset);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    error.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach(key => {data[key] = String(data[key]).trim();});
    if (data.name.length < 2 || data.address.length < 3 || !/^\+?[0-9٠-٩ ()-]{8,20}$/.test(data.phone)) {
      error.textContent = 'تأكد من الاسم ورقم الجوال والعنوان.'; error.hidden = false; return;
    }
    const token = String(window.MASSNET_CONFIG?.telegramBotToken || '').trim();
    const chatId = String(window.MASSNET_CONFIG?.telegramChatId || '').trim();
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(token) || !chatId) {
      error.textContent = 'استقبال الطلبات غير مفعّل بعد. يرجى المحاولة لاحقاً.'; error.hidden = false; return;
    }
    const plans = {home:'للبيت', family:'للعائلة', business:'لأعمالك', unsure:'المساعدة في اختيار الباقة'};
    if (data.name.length > 100 || data.address.length > 250 || data.notes.length > 1000 || !Object.hasOwn(plans, data.plan)) {
      error.textContent = 'تأكد من طول البيانات والباقة المختارة.'; error.hidden = false; return;
    }
    busy = true; submit.disabled = true; submit.querySelector('span').textContent = 'جارٍ إرسال الطلب…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const text = [
        'طلب خدمة جديد — ماس نت',
        '----- الاسم -----', data.name,
        '----- رقم الهاتف -----', data.phone,
        '----- العنوان -----', data.address,
        '----- نوع الاستخدام -----', plans[data.plan],
        '----- ملاحظات -----', data.notes || 'لا يوجد'
      ].join('\n');
      const payload = new URLSearchParams({chat_id:chatId, text});
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:'POST', body:payload, signal:controller.signal, credentials:'omit'
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('خدمة الإرسال لا تستجيب بشكل صحيح. بياناتك ما زالت هنا.'); }
      if (!response.ok || result.ok !== true) {
        const code = result.error_code || response.status;
        if (code === 429) throw new Error('طلبات كثيرة. انتظر قليلاً قبل المحاولة من جديد.');
        if ([400,401,403,404].includes(code)) throw new Error('تعذّر إرسال الطلب. يلزم مراجعة إعدادات البوت والمحادثة.');
        throw new Error('تعذّر إرسال الطلب. بياناتك ما زالت هنا، حاول لاحقاً.');
      }
      document.getElementById('success-message').textContent = 'تم إرسال طلبك إلى فريق ماس نت بنجاح.';
      fields.hidden = true; success.hidden = false; success.focus();
    } catch (err) {
      error.textContent = err.name === 'AbortError' || err instanceof TypeError ? 'تعذّر تأكيد استلام الطلب بسبب الاتصال. قد يكون وصل. تحقّق قبل إعادة الإرسال، وبياناتك ما زالت هنا.' : err.message;
      error.hidden = false;
    } finally {
      clearTimeout(timer); busy = false; submit.disabled = false; submit.querySelector('span').textContent = 'إرسال طلب الخدمة';
    }
  });
})();
