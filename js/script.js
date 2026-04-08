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
  ['c30', 'c60', 'c15'].forEach(function(id) {
    var c = document.getElementById(id);
    if (!c.classList.contains('dk')) {
      c.style.borderColor = '';
      c.style.boxShadow = '';
    }
  });
  var map = { '30min': 'c30', '60min': 'c60', '15min': 'c15' };
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
  var em = document.getElementById('em').value.trim();
  var sess = document.getElementById('sess').value;
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
  document.getElementById('bview').style.display = 'none';
  document.getElementById('succ').classList.add('on');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
