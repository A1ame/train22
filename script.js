
// Exercise data
const exercisesData = {
  // Strength exercises
  'pushups': {
    name: 'Отжимания',
    description: 'Классическое упражнение для развития грудных мышц, трицепсов и плеч',
    difficulty: 'beginner',
    duration: '3 подхода по 15 раз',
    demoImage: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=1770&auto=format&fit=crop'
  },
  'squats': {
    name: 'Приседания',
    description: 'Базовое упражнение для развития мышц ног и ягодиц',
    difficulty: 'beginner',
    duration: '4 подхода по 20 раз',
    demoImage: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1770&auto=format&fit=crop'
  },
  'pullups': {
    name: 'Подтягивания',
    description: 'Эффективное упражнение для развития мышц спины и бицепсов',
    difficulty: 'intermediate',
    duration: '3 подхода по 8-12 раз',
    demoImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1776&auto=format&fit=crop'
  },
  'dumbbell-press': {
    name: 'Жим гантелей',
    description: 'Упражнение для развития грудных мышц и трицепсов с использованием гантелей',
    difficulty: 'intermediate',
    duration: '4 подхода по 10-12 раз',
    demoImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1770&auto=format&fit=crop'
  },
  'deadlift': {
    name: 'Становая тяга',
    description: 'Комплексное упражнение для развития мышц спины, ног и кора',
    difficulty: 'advanced',
    duration: '3 подхода по 8-10 раз',
    demoImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1769&auto=format&fit=crop'
  },
  
  // Cardio exercises can be added similarly
};

// Animation for home page and category page containers
document.addEventListener('DOMContentLoaded', function() {
  const homeContainer = document.querySelector('.home-container');
  const categoryContainer = document.querySelector('.category-container');
  
  if (homeContainer) {
    setTimeout(() => {
      homeContainer.style.opacity = '1';
    }, 100);
  }
  
  if (categoryContainer) {
    setTimeout(() => {
      categoryContainer.style.opacity = '1';
    }, 100);
  }
  
  // AR view functionality
  setupARView();
});

function setupARView() {
  // Check if we're on the AR view page
  const arInactive = document.getElementById('ar-inactive');
  const arActive = document.getElementById('ar-active');
  const arLoading = document.getElementById('ar-loading');
  
  if (!arInactive || !arActive) return;
  
  // Get exercise ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const exerciseData = exercisesData[exerciseId];
  
  if (exerciseData) {
    // Update page title and exercise info
    document.getElementById('exercise-title').textContent = exerciseData.name;
    document.getElementById('ar-exercise-name').textContent = exerciseData.name;
    document.getElementById('ar-exercise-description').textContent = exerciseData.description;
    document.getElementById('ar-overlay-title').textContent = exerciseData.name;
    document.getElementById('ar-overlay-description').textContent = exerciseData.description;
    
    // Set demo image
    if (exerciseData.demoImage) {
      document.getElementById('demo-image').src = exerciseData.demoImage;
    }
  }
  
  // Start AR button
  const startARButton = document.getElementById('start-ar-button');
  if (startARButton) {
    startARButton.addEventListener('click', function() {
      // Hide inactive view and show active view
      arInactive.style.display = 'none';
      arActive.style.display = 'block';
      
      // Simulate AR initialization
      setTimeout(() => {
        arLoading.style.display = 'none';
      }, 2000);
    });
  }
  
  // Stop AR button
  const stopARButton = document.getElementById('stop-ar-button');
  if (stopARButton) {
    stopARButton.addEventListener('click', function() {
      // Hide active view and show inactive view
      arActive.style.display = 'none';
      arInactive.style.display = 'flex';
      
      // Reset loading state for next time
      arLoading.style.display = 'flex';
    });
  }
}
