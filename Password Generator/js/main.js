(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const DOM = {
      alert: $('.alert'),
      password: $('.password'),
      copyBtn: $('.copy-btn'),
      charLength: $('.label-container span'),
      charInput: $('.slider-range'),
      toggleBtns: $$('.interactive-btn'),
      strengthBars: $$('.strength-meter .bars .bar'),
      submitBtn: $('.submit-btn'),
      historyList: $('.history-list'),
  };

  let options = {
      numbers: true,
      symbols: false,
  };

  const updateToggleButtons = () => {
      DOM.toggleBtns.forEach((btn) => {
          const option = btn.getAttribute('data-option');
          btn.classList.toggle('active', options[option]);
      });
  };

  DOM.toggleBtns.forEach((btn) =>
      btn.addEventListener('click', () => {
          const option = btn.getAttribute('data-option');
          options[option] = !options[option];
          updateToggleButtons();
      })
  );

  DOM.copyBtn.addEventListener('click', () => {
      copyToClipboard(DOM.password.textContent);
      DOM.alert.style.visibility = 'visible';

      setTimeout(() => {
          DOM.alert.style.visibility = 'hidden';
      }, 3000);
  });

  DOM.charInput.addEventListener('input', (e) => {
      DOM.charLength.textContent = e.target.value;
  });

  DOM.submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const charLength = DOM.charInput.value;
      const password = generateRandomPassword(
          charLength,
          options.numbers,
          options.symbols
      );

      DOM.password.textContent = password;
      addToHistory(password);
      setBars(checkPasswordStrength(password, charLength));
  });

  const addToHistory = (password) => {
      const li = document.createElement('li');
      li.textContent = password;
      DOM.historyList.prepend(li);
  };

  const copyToClipboard = async (str) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
          return await navigator.clipboard.writeText(str);
      }
      throw new Error('Clipboard not supported');
  };

  const generateRandomPassword = (length, includeNumbers, includeSymbols) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nums = '0123456789';
      const syms = '!?@#$%^&*()_';
      let charset = chars;
      if (includeNumbers) charset += nums;
      if (includeSymbols) charset += syms;

      return Array.from({ length }, () => {
          const index = Math.floor(Math.random() * charset.length);
          return charset[index];
      }).join('');
  };

  const checkPasswordStrength = (password, charLength) => {
      if (!options.numbers && !options.symbols && charLength < 8) {
          return 0; 
      }
      let score = 0;
      if (/[!?@#$%^&*()_]/.test(password)) score += 10;
      if (/\d/.test(password)) score += 10;
      score += password.length >= 8 ? password.length - 7 : 0;
      return Math.min(score, 40);
  };

  const setBars = (score) => {
    DOM.strengthBars.forEach((bar, index) => {
        bar.classList.remove('active-safe', 'active-warning', 'active-danger');
        if (score === 0 && index === 0) {
            bar.classList.add('active-danger');
        } else if (index < score / 10) {
            bar.classList.add(
                score < 10 ? 'active-danger' : score < 30 ? 'active-warning' : 'active-safe'
            );
        }
    });
};

  const adjustFontSize = (password) => {
    if (password.length > 20) {
        DOM.password.style.fontSize = '1rem'; 
    } else {
        DOM.password.style.fontSize = '1.25rem'; 
    }
  };

  DOM.submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const charLength = DOM.charInput.value;
    const password = generateRandomPassword(
        charLength,
        options.numbers,
        options.symbols
    );

    DOM.password.textContent = password;
    adjustFontSize(password); 
    addToHistory(password);
    setBars(checkPasswordStrength(password, charLength));
  });

})();
