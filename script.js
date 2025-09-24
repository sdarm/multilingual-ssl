// Basic interactivity and validation
(function () {
  const form = document.getElementById('params-form');
  const yearInput = document.getElementById('year');
  const langGroup = document.getElementById('languages');
  const langError = document.getElementById('lang-error');
  const langCounter = document.getElementById('lang-counter');
  const submitBtn = document.getElementById('submit-btn');
  const result = document.getElementById('result');

  // Set default year to current year
  const now = new Date();
  yearInput.value = now.getFullYear();

  function getSelectedLanguages() {
    return Array.from(form.querySelectorAll('input[name="languages"]:checked')).map(
      (el) => el.value
    );
  }

  function getSelectedQuarter() {
    const q = form.querySelector('input[name="quarter"]:checked');
    return q ? q.value : null;
  }

  function validateYear() {
    const min = parseInt(yearInput.min, 10);
    const max = parseInt(yearInput.max, 10);
    const val = parseInt(yearInput.value, 10);
    const errorEl = yearInput.parentElement.querySelector('.error');
    let msg = '';
    if (!val) msg = 'Year is required';
    else if (val < min || val > max) msg = `Year must be between ${min} and ${max}`;
    errorEl.textContent = msg;
    return msg === '';
  }

  function validateQuarter() {
    const errorEl = form.querySelector('fieldset .error');
    const ok = !!getSelectedQuarter();
    errorEl.textContent = ok ? '' : 'Please choose a quarter';
    return ok;
  }

  function validateLanguages() {
    const selected = getSelectedLanguages();
    const count = selected.length;
    langCounter.textContent = `${count}/3 selected`;
    let msg = '';
    if (count === 0) msg = 'Pick at least one language';
    else if (count > 3) msg = 'You can select up to 3 languages';
    langError.textContent = msg;

    // Disable remaining checkboxes when 3 are selected
    const checkboxes = Array.from(form.querySelectorAll('input[name="languages"]'));
    const disableOthers = count >= 3;
    checkboxes.forEach((cb) => {
      if (!cb.checked) cb.disabled = disableOthers;
    });
    return msg === '';
  }

  function updateSubmitState() {
    const ok = validateYear() && validateQuarter() && validateLanguages();
    submitBtn.disabled = !ok;
  }

  // Listeners
  yearInput.addEventListener('input', () => { validateYear(); updateSubmitState(); });
  form.querySelectorAll('input[name="quarter"]').forEach((el) => {
    el.addEventListener('change', () => { validateQuarter(); updateSubmitState(); });
  });
  langGroup.addEventListener('change', () => { validateLanguages(); updateSubmitState(); });

  // Initial state
  validateYear();
  validateQuarter();
  validateLanguages();
  updateSubmitState();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;
    const data = {
      year: parseInt(yearInput.value, 10),
      quarter: parseInt(getSelectedQuarter() || '0', 10),
      languages: getSelectedLanguages(),
    };
    result.style.display = 'block';
    result.textContent = JSON.stringify(data, null, 2);
    // In a real app, you'd send `data` to a backend
  });
})();
