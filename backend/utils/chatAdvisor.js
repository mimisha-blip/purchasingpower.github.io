const STARTERS = [
  'What does Travel Affordability Score mean?',
  'Why is rent the biggest shock in San Francisco?',
  'What is cheaper in the US than India?',
  'How much should I budget for San Francisco?'
];

function normalize(question) {
  return question.toLowerCase();
}

export function chatStarters() {
  return STARTERS;
}

export function answerChatQuestion(question) {
  const q = normalize(question);

  if (q.includes('affordability score') || q.includes('travel affordability')) {
    return {
      message: 'Travel Affordability Score means the price adjusted into what it feels like in your home economy. Currency conversion says what you pay after exchange rates; the score explains whether that price feels normal, cheap, or expensive compared with home.'
    };
  }

  if ((q.includes('rent') || q.includes('housing')) && (q.includes('san francisco') || q.includes('sf') || q.includes('shock'))) {
    return {
      message: 'Housing is the biggest shock in San Francisco because rent is estimated around +280% compared with an India-based lifestyle benchmark. Even if food, utilities, and transport rise too, rent dominates the monthly budget.'
    };
  }

  if (q.includes('cheaper') || q.includes('affordable') || q.includes('electronics')) {
    return {
      message: 'Electronics are the most affordable category in the India to San Francisco comparison. Items like an iPhone can be closer to normal US pricing and may feel less inflated than rent, food, or services when compared with India.'
    };
  }

  if (q.includes('budget') || q.includes('monthly') || q.includes('san francisco') || q.includes('moving')) {
    return {
      message: 'For an average lifestyle in San Francisco, the current relocation estimate is about USD 4,500 per month. That maps to roughly INR 95,000 per month as an equivalent lifestyle benchmark in India. The biggest cost pressure is rent.'
    };
  }

  if (q.includes('iphone') || q.includes('phone')) {
    return {
      message: 'For iPhone or smartphone questions, compare against electronics prices, not food. The app treats iPhone-style items as product/electronics costs, so the answer focuses on whether the device price is normal locally and how it feels against Indian electronics pricing.'
    };
  }

  return {
    message: 'I can help explain Travel Affordability Score, item price comparisons, and relocation costs like India to San Francisco. Try asking about rent, electronics, monthly budget, or why a price feels expensive.'
  };
}
