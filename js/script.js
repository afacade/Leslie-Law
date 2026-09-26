var FIELD_LABELS = {
  fn: 'First Name',
  ln: 'Last Name',
  em: 'Email Address',
  sess: 'Session Type',
  summ: 'Matter Summary'
};
var VALIDATED = ['fn', 'ln', 'em', 'sess', 'summ', 'ack'];
var PAGE_TITLES = {
  home: 'Leslie Leone | San Francisco Bay Area Attorney',
  about: 'About Leslie Leone | San Francisco Bay Area Attorney',
  employment: 'Employment Law | Leslie Leone, San Francisco Bay Area Attorney',
  pi: 'Personal Injury | Leslie Leone, San Francisco Bay Area Attorney',
  profile: 'Attorney Profile | Leslie C. Leone',
  book: 'Book a Consultation | Leslie Leone',
  accessibility: 'Accessibility Statement | Leslie Leone'
};

function scrollBehavior() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function toggleNav() {
  var open = document.getElementById('navlist').classList.toggle('open');
  document.getElementById('navtoggle').setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeNav() {
  document.getElementById('navlist').classList.remove('open');
  document.getElementById('navtoggle').setAttribute('aria-expanded', 'false');
}

function show(id) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('skiplink').setAttribute('href', '#main-' + id);
  document.title = PAGE_TITLES[id] || document.title;
  document.querySelectorAll('[data-nav]').forEach(function(b) {
    if (b.getAttribute('data-nav') === id) {
      b.setAttribute('aria-current', 'page');
    } else {
      b.removeAttribute('aria-current');
    }
  });
  closeNav();
  if (id === 'book') {
    document.getElementById('succ').classList.remove('on');
    document.getElementById('bview').style.display = 'block';
  }
  document.getElementById('main-' + id).focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
}

function pick(tier) {
  var map = { '30min': 'c30', '60min': 'c60', '15min': 'c15' };
  Object.keys(map).forEach(function(t) {
    var card = document.getElementById(map[t]);
    var on = t === tier;
    card.classList.toggle('sel', on);
    card.querySelector('.bbtn').setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  var sess = document.getElementById('sess');
  sess.value = tier;
  clearError('sess');
  sess.focus({ preventScroll: true });
  document.querySelector('.bform').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}

function setError(id, message) {
  var box = document.getElementById('err-' + id);
  box.textContent = message;
  box.hidden = false;
  document.getElementById(id).setAttribute('aria-invalid', 'true');
}

function clearError(id) {
  var box = document.getElementById('err-' + id);
  if (box) {
    box.textContent = '';
    box.hidden = true;
  }
  document.getElementById(id).removeAttribute('aria-invalid');
}

function submitForm() {
  var summary = document.getElementById('form-error');
  var invalid = [];
  VALIDATED.forEach(clearError);
  summary.textContent = '';
  summary.hidden = true;

  Object.keys(FIELD_LABELS).forEach(function(id) {
    if (!document.getElementById(id).value.trim()) {
      setError(id, FIELD_LABELS[id] + ' is required.');
      invalid.push(id);
    }
  });

  var em = document.getElementById('em').value.trim();
  if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    setError('em', 'Enter an email address in the format name@example.com.');
    invalid.push('em');
  }

  var summ = document.getElementById('summ').value.trim();
  var sentences = summ.split(/[.!?]+/).filter(function(s) {
    return s.trim().length > 0;
  });
  if (sentences.length > 5) {
    setError('summ', 'Please shorten your Matter Summary to 5 sentences or fewer. It currently has ' + sentences.length + '.');
    invalid.push('summ');
  }

  if (!document.getElementById('ack').checked) {
    setError('ack', 'Please acknowledge the terms before submitting.');
    invalid.push('ack');
  }

  if (invalid.length) {
    summary.textContent = invalid.length === 1
      ? 'There is 1 problem with your booking. Please review the highlighted field below.'
      : 'There are ' + invalid.length + ' problems with your booking. Please review the highlighted fields below.';
    summary.hidden = false;
    document.getElementById(invalid[0]).focus();
    return;
  }

  var sessLabels = {
    '30min': '30-Minute Initial Review ($350)',
    '60min': '60-Minute Strategic Evaluation ($600)',
    '15min': '15-Minute Preliminary Call (Complimentary)'
  };
  var sess = document.getElementById('sess').value;
  var sessLabel = sessLabels[sess] || sess;

  var dt = document.getElementById('dt').value;
  var dateDisplay = 'To be confirmed';
  if (dt) {
    var parts = dt.split('-');
    var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    dateDisplay = dateObj.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  var ln = document.getElementById('ln').value.trim();
  var fullName = document.getElementById('fn').value.trim() + (ln ? ' ' + ln : '');

  document.getElementById('conf-name').textContent = fullName;
  document.getElementById('conf-email-name').textContent = fullName;
  document.getElementById('conf-date').textContent = dateDisplay;
  document.getElementById('conf-session').textContent = sessLabel;

  document.getElementById('bview').style.display = 'none';
  var succ = document.getElementById('succ');
  succ.classList.add('on');
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
  succ.focus({ preventScroll: true });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('navlist').classList.contains('open')) {
    closeNav();
    document.getElementById('navtoggle').focus();
  }
});

VALIDATED.forEach(function(id) {
  var field = document.getElementById(id);
  field.addEventListener(id === 'ack' ? 'change' : 'input', function() {
    if (field.getAttribute('aria-invalid') === 'true') {
      clearError(id);
    }
  });
});

document.querySelector('[data-nav="home"]').setAttribute('aria-current', 'page');
