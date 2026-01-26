// Format currency input with ₹ symbol
export const formatCurrency = (value) => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  // Add ₹ prefix
  return `₹${numbers}`;
};

// Parse currency value (remove ₹ and return number)
export const parseCurrency = (value) => {
  return value.replace(/[₹,\s]/g, '');
};

// Display charges as "₹X per day" (default unit)
export const formatChargesDisplay = (charges) => {
  if (!charges || !String(charges).trim()) return '—';
  const num = parseCurrency(charges);
  if (/^\d+$/.test(num)) return `₹${num} per day`;
  return charges;
};

// Format time input (hours and minutes)
// Accepts formats like: "2h 30m", "2 hours 30 min", "2:30", "2h30m"
export const formatTime = (value) => {
  if (!value) return '';
  
  // Remove all non-digit characters except h, m, :, and spaces
  let cleaned = value.replace(/[^\dhm:\s]/gi, '');
  
  // If it's already in a good format, return as is
  if (/^\d+[hm]?\s*\d*[hm]?$/i.test(cleaned) || /^\d+:\d+$/.test(cleaned)) {
    return cleaned;
  }
  
  // Try to parse and format
  const hoursMatch = cleaned.match(/(\d+)\s*h/i);
  const minutesMatch = cleaned.match(/(\d+)\s*m/i);
  const colonMatch = cleaned.match(/(\d+):(\d+)/);
  
  if (colonMatch) {
    const hours = colonMatch[1];
    const minutes = colonMatch[2];
    return `${hours}h ${minutes}m`;
  }
  
  if (hoursMatch || minutesMatch) {
    const hours = hoursMatch ? hoursMatch[1] : '0';
    const minutes = minutesMatch ? minutesMatch[1] : '0';
    return `${hours}h ${minutes}m`;
  }
  
  // If just numbers, assume hours
  const numbers = cleaned.replace(/\D/g, '');
  if (numbers) {
    return `${numbers}h`;
  }
  
  return cleaned;
};

// Parse time value to hours and minutes
export const parseTime = (value) => {
  if (!value) return { hours: 0, minutes: 0 };
  
  const hoursMatch = value.match(/(\d+)\s*h/i);
  const minutesMatch = value.match(/(\d+)\s*m/i);
  const colonMatch = value.match(/(\d+):(\d+)/);
  
  let hours = 0;
  let minutes = 0;
  
  if (colonMatch) {
    hours = parseInt(colonMatch[1], 10) || 0;
    minutes = parseInt(colonMatch[2], 10) || 0;
  } else {
    hours = hoursMatch ? parseInt(hoursMatch[1], 10) || 0 : 0;
    minutes = minutesMatch ? parseInt(minutesMatch[1], 10) || 0 : 0;
    
    // If no hours/minutes found but there are numbers, assume hours
    if (!hoursMatch && !minutesMatch) {
      const numbers = value.replace(/\D/g, '');
      if (numbers) {
        hours = parseInt(numbers, 10) || 0;
      }
    }
  }
  
  return { hours, minutes };
};

// Format time input on change
export const handleTimeInputChange = (e, setValue) => {
  const input = e.target.value;
  const formatted = formatTime(input);
  setValue(formatted);
};

// Format currency input on change
export const handleCurrencyInputChange = (e, setValue) => {
  const input = e.target.value;
  const formatted = formatCurrency(input);
  setValue(formatted);
};

// Format date-time for display
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date only for display
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format time string (HH:MM) to 12-hour format
export const formatTimeDisplay = (timeString) => {
  if (!timeString) return '—';
  // timeString is in HH:MM format
  const [hours, minutes] = timeString.split(':');
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};
