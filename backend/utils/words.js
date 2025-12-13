const words = [
  // Animals
  'cat', 'dog', 'elephant', 'lion', 'tiger', 'bear', 'rabbit', 'horse', 'cow', 'pig',
  'sheep', 'goat', 'chicken', 'duck', 'fish', 'bird', 'snake', 'frog', 'turtle', 'monkey',
  'giraffe', 'zebra', 'hippo', 'rhino', 'kangaroo', 'panda', 'koala', 'penguin', 'owl', 'eagle',
  
  // Objects
  'car', 'house', 'tree', 'flower', 'book', 'chair', 'table', 'phone', 'computer', 'television',
  'bicycle', 'airplane', 'boat', 'train', 'bus', 'truck', 'motorcycle', 'helicopter', 'rocket', 'balloon',
  'umbrella', 'hat', 'shoes', 'shirt', 'pants', 'dress', 'jacket', 'glasses', 'watch', 'ring',
  
  // Food
  'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'pineapple', 'cherry', 'peach', 'pear',
  'pizza', 'hamburger', 'hotdog', 'sandwich', 'cake', 'cookie', 'ice cream', 'chocolate', 'candy', 'bread',
  'cheese', 'milk', 'egg', 'chicken', 'fish', 'rice', 'pasta', 'soup', 'salad', 'coffee',
  
  // Nature
  'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'fire', 'water', 'earth',
  'mountain', 'river', 'ocean', 'forest', 'desert', 'beach', 'island', 'volcano', 'rainbow', 'lightning',
  'flower', 'grass', 'leaf', 'branch', 'root', 'seed', 'fruit', 'vegetable', 'garden', 'park',
  
  // Actions
  'run', 'walk', 'jump', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry', 'sleep',
  'eat', 'drink', 'read', 'write', 'draw', 'paint', 'cook', 'clean', 'wash', 'drive',
  'play', 'work', 'study', 'teach', 'learn', 'think', 'dream', 'smile', 'hug', 'kiss',
  
  // Sports
  'football', 'basketball', 'baseball', 'tennis', 'golf', 'soccer', 'volleyball', 'swimming', 'running', 'cycling',
  'boxing', 'wrestling', 'gymnastics', 'skating', 'skiing', 'surfing', 'fishing', 'hunting', 'climbing', 'hiking',
  
  // Professions
  'doctor', 'teacher', 'police', 'firefighter', 'nurse', 'chef', 'artist', 'musician', 'actor', 'writer',
  'engineer', 'pilot', 'driver', 'farmer', 'builder', 'mechanic', 'electrician', 'plumber', 'dentist', 'lawyer',
  
  // Body Parts
  'head', 'face', 'eye', 'nose', 'mouth', 'ear', 'hair', 'neck', 'shoulder', 'arm',
  'hand', 'finger', 'chest', 'back', 'stomach', 'leg', 'knee', 'foot', 'toe', 'heart',
  
  // Emotions
  'happy', 'sad', 'angry', 'excited', 'scared', 'surprised', 'confused', 'tired', 'bored', 'nervous',
  'proud', 'shy', 'brave', 'kind', 'mean', 'funny', 'serious', 'calm', 'worried', 'relaxed',
  
  // Colors
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
  'gray', 'silver', 'gold', 'violet', 'indigo', 'turquoise', 'maroon', 'navy', 'lime', 'olive',
  
  // Shapes
  'circle', 'square', 'triangle', 'rectangle', 'oval', 'diamond', 'star', 'heart', 'arrow', 'cross',
  'line', 'curve', 'angle', 'corner', 'edge', 'point', 'center', 'side', 'top', 'bottom',
  
  // Weather
  'sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'stormy', 'foggy', 'hot', 'cold', 'warm',
  'cool', 'humid', 'dry', 'wet', 'freezing', 'boiling', 'mild', 'severe', 'calm', 'rough',
  
  // Time
  'morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'noon', 'midnight', 'today', 'tomorrow',
  'yesterday', 'week', 'month', 'year', 'hour', 'minute', 'second', 'early', 'late', 'on time',
  
  // Places
  'school', 'hospital', 'store', 'restaurant', 'library', 'museum', 'theater', 'stadium', 'park', 'zoo',
  'beach', 'mountain', 'city', 'town', 'village', 'country', 'state', 'continent', 'planet', 'space',
  
  // Transportation
  'walk', 'run', 'drive', 'fly', 'sail', 'ride', 'travel', 'journey', 'trip', 'vacation',
  'road', 'street', 'highway', 'bridge', 'tunnel', 'station', 'airport', 'port', 'garage', 'parking',
  
  // Technology
  'robot', 'computer', 'internet', 'website', 'email', 'message', 'video', 'photo', 'music', 'game',
  'app', 'software', 'hardware', 'screen', 'keyboard', 'mouse', 'camera', 'microphone', 'speaker', 'battery',
  
  // Household Items
  'bed', 'pillow', 'blanket', 'lamp', 'mirror', 'clock', 'calendar', 'picture', 'window', 'door',
  'key', 'lock', 'handle', 'switch', 'plug', 'wire', 'remote', 'vacuum', 'broom', 'mop',
  
  // Clothing
  'sock', 'shoe', 'boot', 'sandal', 'slipper', 'glove', 'mitten', 'scarf', 'tie', 'belt',
  'pocket', 'button', 'zipper', 'sleeve', 'collar', 'hood', 'cap', 'helmet', 'crown', 'mask',
  
  // Tools
  'hammer', 'screwdriver', 'wrench', 'saw', 'drill', 'nail', 'screw', 'bolt', 'nut', 'rope',
  'ladder', 'bucket', 'shovel', 'rake', 'hose', 'scissors', 'knife', 'fork', 'spoon', 'plate',
  
  // Musical Instruments
  'piano', 'guitar', 'violin', 'drum', 'flute', 'trumpet', 'saxophone', 'clarinet', 'harp', 'organ',
  'bass', 'cello', 'banjo', 'harmonica', 'accordion', 'xylophone', 'triangle', 'cymbals', 'bell', 'whistle',
  
  // School Supplies
  'pencil', 'pen', 'eraser', 'ruler', 'paper', 'notebook', 'folder', 'backpack', 'calculator', 'stapler',
  'tape', 'glue', 'marker', 'crayon', 'paint', 'brush', 'canvas', 'easel', 'desk', 'blackboard',
  
  // Games and Toys
  'ball', 'doll', 'puzzle', 'blocks', 'cards', 'dice', 'board', 'chess', 'checkers', 'domino',
  'kite', 'yo-yo', 'top', 'marbles', 'jump rope', 'hula hoop', 'frisbee', 'boomerang', 'slingshot', 'whistle',
  
  // Miscellaneous
  'magic', 'mystery', 'secret', 'surprise', 'gift', 'present', 'party', 'celebration', 'festival', 'holiday',
  'adventure', 'journey', 'quest', 'mission', 'goal', 'dream', 'wish', 'hope', 'faith', 'love',
  'friendship', 'family', 'team', 'group', 'crowd', 'audience', 'community', 'society', 'world', 'universe'
];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

module.exports = { words, getRandomWord };