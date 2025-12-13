// Dictionary of 500 drawing words
export const DRAWING_WORDS = [
  // Animals
  'cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken',
  'duck', 'rabbit', 'mouse', 'elephant', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer',
  'monkey', 'giraffe', 'zebra', 'hippo', 'rhino', 'kangaroo', 'panda', 'koala', 'penguin', 'owl',
  'eagle', 'snake', 'turtle', 'frog', 'butterfly', 'bee', 'spider', 'ant', 'ladybug', 'dragonfly',
  
  // Food & Drinks
  'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'pineapple', 'cherry', 'lemon', 'peach',
  'bread', 'cake', 'pizza', 'burger', 'sandwich', 'cookie', 'donut', 'ice cream', 'chocolate', 'candy',
  'coffee', 'tea', 'milk', 'juice', 'water', 'soda', 'wine', 'beer', 'soup', 'salad',
  'pasta', 'rice', 'chicken', 'beef', 'fish', 'egg', 'cheese', 'butter', 'honey', 'sugar',
  
  // Objects & Items
  'car', 'bike', 'bus', 'train', 'plane', 'boat', 'ship', 'rocket', 'helicopter', 'motorcycle',
  'house', 'building', 'castle', 'bridge', 'tower', 'church', 'school', 'hospital', 'store', 'restaurant',
  'chair', 'table', 'bed', 'sofa', 'lamp', 'clock', 'mirror', 'window', 'door', 'key',
  'book', 'pen', 'pencil', 'paper', 'computer', 'phone', 'camera', 'television', 'radio', 'guitar',
  
  // Nature & Weather
  'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'storm', 'rainbow', 'lightning',
  'tree', 'flower', 'grass', 'mountain', 'river', 'lake', 'ocean', 'beach', 'forest', 'desert',
  'rock', 'stone', 'sand', 'fire', 'water', 'earth', 'sky', 'ground', 'hill', 'valley',
  'leaf', 'branch', 'root', 'seed', 'fruit', 'vegetable', 'garden', 'park', 'field', 'farm',
  
  // Body Parts
  'head', 'face', 'eye', 'nose', 'mouth', 'ear', 'hair', 'neck', 'shoulder', 'arm',
  'hand', 'finger', 'thumb', 'leg', 'foot', 'toe', 'knee', 'elbow', 'back', 'chest',
  'heart', 'brain', 'tooth', 'tongue', 'lip', 'cheek', 'chin', 'forehead', 'eyebrow', 'eyelash',
  
  // Clothing & Accessories
  'shirt', 'pants', 'dress', 'skirt', 'jacket', 'coat', 'sweater', 'hat', 'cap', 'scarf',
  'gloves', 'socks', 'shoes', 'boots', 'sandals', 'belt', 'tie', 'watch', 'glasses', 'ring',
  'necklace', 'earring', 'bracelet', 'bag', 'purse', 'wallet', 'umbrella', 'backpack', 'helmet', 'crown',
  
  // Sports & Activities
  'football', 'basketball', 'baseball', 'tennis', 'golf', 'swimming', 'running', 'jumping', 'dancing', 'singing',
  'reading', 'writing', 'drawing', 'painting', 'cooking', 'eating', 'sleeping', 'walking', 'driving', 'flying',
  'playing', 'working', 'studying', 'teaching', 'learning', 'shopping', 'cleaning', 'washing', 'building', 'fixing',
  
  // Emotions & Actions
  'happy', 'sad', 'angry', 'excited', 'scared', 'surprised', 'tired', 'hungry', 'thirsty', 'cold',
  'hot', 'warm', 'cool', 'big', 'small', 'tall', 'short', 'fat', 'thin', 'strong',
  'weak', 'fast', 'slow', 'loud', 'quiet', 'bright', 'dark', 'light', 'heavy', 'soft',
  
  // Colors & Shapes
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
  'gray', 'gold', 'silver', 'circle', 'square', 'triangle', 'rectangle', 'oval', 'diamond', 'star',
  'heart', 'arrow', 'line', 'curve', 'angle', 'corner', 'edge', 'center', 'top', 'bottom',
  
  // Tools & Instruments
  'hammer', 'saw', 'drill', 'screwdriver', 'wrench', 'knife', 'fork', 'spoon', 'plate', 'cup',
  'bowl', 'pot', 'pan', 'oven', 'stove', 'refrigerator', 'microwave', 'toaster', 'blender', 'mixer',
  'vacuum', 'broom', 'mop', 'bucket', 'soap', 'towel', 'brush', 'comb', 'scissors', 'needle',
  
  // Entertainment & Games
  'movie', 'music', 'song', 'dance', 'party', 'game', 'toy', 'doll', 'ball', 'puzzle',
  'cards', 'dice', 'chess', 'checkers', 'video game', 'board game', 'magic', 'circus', 'theater', 'concert',
  
  // School & Education
  'teacher', 'student', 'classroom', 'desk', 'blackboard', 'chalk', 'eraser', 'ruler', 'calculator', 'backpack',
  'notebook', 'textbook', 'homework', 'test', 'grade', 'diploma', 'graduation', 'university', 'college', 'library',
  
  // Jobs & Professions
  'doctor', 'nurse', 'teacher', 'police', 'firefighter', 'pilot', 'chef', 'farmer', 'artist', 'musician',
  'writer', 'actor', 'dancer', 'singer', 'athlete', 'scientist', 'engineer', 'lawyer', 'judge', 'president',
  
  // Time & Calendar
  'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year',
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February', 'March',
  'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'birthday',
  
  // Numbers & Math
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'hundred', 'thousand', 'million', 'plus', 'minus', 'multiply', 'divide', 'equal', 'number', 'count',
  
  // Miscellaneous
  'love', 'peace', 'war', 'freedom', 'justice', 'truth', 'lie', 'secret', 'surprise', 'gift',
  'birthday', 'wedding', 'funeral', 'holiday', 'vacation', 'travel', 'adventure', 'journey', 'destination', 'map',
  'treasure', 'gold', 'diamond', 'jewel', 'crown', 'castle', 'kingdom', 'princess', 'prince', 'king',
  'queen', 'knight', 'dragon', 'fairy', 'angel', 'devil', 'ghost', 'monster', 'alien', 'robot'
];

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * DRAWING_WORDS.length);
  return DRAWING_WORDS[randomIndex];
};

export const getRandomWords = (count = 3) => {
  const shuffled = [...DRAWING_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};