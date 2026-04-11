function show(id) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'book') {
    document.getElementById('succ').classList.remove('on');
    document.getElementById('bview').style.display = 'block';
  }
}

function pick(tier) {
  ['c30', 'c60'].forEach(function(id) {
    var c = document.getElementById(id);
    if (!c.classList.contains('dk')) {
      c.style.borderColor = '';
      c.style.boxShadow = '';
    }
  });
  var map = { '30min': 'c30', '60min': 'c60' };
  var card = document.getElementById(map[tier]);
  if (card && !card.classList.contains('dk')) {
    card.style.borderColor = 'var(--gold)';
    card.style.boxShadow = '0 6px 32px rgba(0,0,0,.07)';
  }
  document.getElementById('sess').value = tier;
  document.querySelector('.bform').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm() {
  var fn = document.getElementById('fn').value.trim();
  var ln = document.getElementById('ln').value.trim();
  var em = document.getElementById('em').value.trim();
  var sess = document.getElementById('sess').value;
  var dt = document.getElementById('dt').value;
  var summ = document.getElementById('summ').value.trim();
  var ack = document.getElementById('ack').checked;
  if (!fn || !em || !sess || !summ) {
    alert('Please complete all required fields, including the Matter Summary.');
    return;
  }
  if (!ack) {
    alert('Please acknowledge the terms before submitting.');
    return;
  }
  var sentences = summ.split(/[.!?]+/).filter(function(s) {
    return s.trim().length > 0;
  });
  if (sentences.length > 5) {
    alert('Please keep your Matter Summary to a maximum of 5 sentences.');
    return;
  }

  // Session type labels
  var sessLabels = {
    '30min': '30-Minute Initial Review ($350)',
    '60min': '60-Minute Strategic Evaluation ($600)'
  };
  var sessLabel = sessLabels[sess] || sess;

  // Format date
  var dateDisplay = 'To be confirmed';
  if (dt) {
    var parts = dt.split('-');
    var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    dateDisplay = dateObj.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  var fullName = fn + (ln ? ' ' + ln : '');

  // Populate confirmation
  document.getElementById('conf-name').textContent = fullName;
  document.getElementById('conf-email-name').textContent = fullName;
  document.getElementById('conf-date').textContent = dateDisplay;
  document.getElementById('conf-session').textContent = sessLabel;

  // Build mailto to leslieleone@me.com
  var subject = encodeURIComponent('New Consultation Booking — ' + sessLabel + ' — ' + fullName);
  var body = encodeURIComponent(
    'New consultation booking received:\n\n' +
    'Name: ' + fullName + '\n' +
    'Email: ' + em + '\n' +
    'Phone: ' + (document.getElementById('ph').value.trim() || 'Not provided') + '\n' +
    'Session: ' + sessLabel + '\n' +
    'Preferred Date: ' + dateDisplay + '\n\n' +
    'Matter Summary:\n' + summ
  );
  window.open('mailto:leslieleone@me.com?subject=' + subject + '&body=' + body, '_self');

  document.getElementById('bview').style.display = 'none';
  document.getElementById('succ').classList.add('on');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
