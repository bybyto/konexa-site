/**
 * Date utility functions for Konexa community website
 * Handles date formatting and operations
 */

// Format date to display time if today, or date + time if older
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  }
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format date to "X time ago" (e.g., "2 minutes ago", "5 days ago")
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now - date) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Less than a month
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // Default to regular date format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format a date for countdown display (days, hours, minutes, seconds)
export const formatCountdown = (targetDate) => {
  const target = new Date(targetDate);
  const now = new Date();
  
  if (now >= target) {
    return { expired: true, timeString: 'Expired' };
  }
  
  const diff = target - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`
  };
};

// Get formatted date for next week
export const getNextWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// Check if a date is in the past
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  return date < now;
};

// Get day of week name from date
export const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};