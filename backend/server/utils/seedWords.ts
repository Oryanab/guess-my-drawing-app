export const easyWordsList = [
  "cheese",
  "bone",
  "socks",
  "leaf",
  "whale",
  "pie",
  "shirt",
  "orange",
  "lollipop",
  "bed",
  "mouth",
  "person",
  "horse",
  "snake",
  "jar",
  "spoon",
  "lamp",
  "kite",
  "monkey",
  "swing",
  "cloud",
  "snowman",
  "baby",
  "eyes",
  "pen",
  "giraffe",
  "grapes",
  "book",
  "ocean",
  "star",
  "cupcake",
  "cow",
  "lips",
  "worm",
  "sun",
  "basketball",
  "hat",
  "bus",
  "chair",
  "purse",
  "head",
  "spider",
  "shoe",
  "ghost",
  "coat",
  "chicken",
  "heart",
  "jellyfish",
  "tree",
  "seashell",
  "duck",
  "bracelet",
  "grass",
  "jacket",
  "slide",
  "doll",
  "spider",
  "clock",
  "cup",
  "bridge",
  "apple",
  "balloon",
  "drum",
  "ears",
  "egg",
  "bread",
  "nose",
  "house",
  "beach",
  "airplane",
  "inchworm",
  "hippo",
  "light",
  "turtle",
  "ball",
  "carrot",
  "cherry",
  "ice",
  "pencil",
  "circle",
  "bed",
  "ant",
  "girl",
  "glasses",
  "flower",
  "mouse",
  "banana",
  "alligator",
  "bell",
  "robot",
  "smile",
  "bike",
  "rocket",
  "dinosaur",
  "dog",
  "bunny",
  "cookie",
  "bowl",
  "apple",
  "door",
];

export const mediumWordsList = [
  "horse",
  "door",
  "song",
  "trip",
  "backbone",
  "bomb",
  "round",
  "treasure",
  "garbage",
  "park",
  "whistle",
  "palace",
  "baseball",
  "coal",
  "queen",
  "dominoes",
  "photograph",
  "computer",
  "hockey",
  "aircraft",
  "pepper",
  "key",
  "iPad",
  "whisk",
  "cake",
  "circus",
  "battery",
  "mailman",
  "cowboy",
  "password",
  "bicycle",
  "skate",
  "electricity",
  "lightsaber",
  "nature",
  "shallow",
  "toast",
  "outside",
  "America",
  "roller",
  "blading",
  "gingerbread",
  "man",
  "bowtie",
  "light",
  "bulb",
  "platypus",
  "music",
  "sailboat",
  "popsicle",
  "knee",
  "pineapple",
  "tusk",
  "sprinkler",
  "money",
  "spool",
  "lighthouse",
  "doormat",
  "face",
  "flute",
  "owl",
  "gate",
  "suitcase",
  "bathroom",
  "scale",
  "peach",
  "newspaper",
  "watering",
  "can",
  "hook",
  "school",
  "beaver",
  "camera",
  "hair",
  "dryer",
  "mushroom",
  "quilt",
  "chalk",
  "dollar",
  "soda",
  "chin",
  "swing",
  "garden",
  "ticket",
  "boot",
  "cello",
  "rain",
  "clam",
  "pelican",
  "stingray",
  "nail",
  "sheep",
  "stoplight",
  "coconut",
  "crib",
  "hippopotamus",
  "ring",
  "video",
  "camera",
  "snowflake",
];

export const hardWordsList = [
  "clog",
  "chestnut",
  "commercial",
  "Atlantis",
  "mine",
  "comfy",
  "ironic",
  "implode",
  "lie",
  "philosopher",
  "hang",
  "vision",
  "dorsal",
  "hail",
  "upgrade",
  "peasant",
  "stout",
  "yolk",
  "car",
  "important",
  "retail",
  "laser",
  "crisp",
  "overture",
  "blacksmith",
  "ditch",
  "exercise",
  "mime",
  "pastry",
  "kilogram",
  "ligament",
  "stowaway",
  "opaque",
  "drought",
  "shrew",
  "tinting",
  "mooch",
  "lyrics",
  "neutron",
  "stockholder",
  "flotsam",
  "cartography",
  "ice",
  "fishing",
  "eureka",
  "darkness",
  "dripping",
  "wobble",
  "brunette",
  "rubber",
  "tutor",
  "migrate",
  "myth",
  "psychologist",
  "quarantine",
  "slump",
  "landfill",
  "diagonal",
  "inquisition",
  "husband",
  "ten",
  "exponential",
  "neighborhood",
  "jazz",
  "catalog",
  "gallop",
  "snag",
  "acre",
  "protestant",
  "random",
  "twang",
  "flutter",
  "fireside",
  "clue",
  "figment",
  "ringleader",
  "parody",
  "jungle",
  "armada",
  "mirror",
  "newsletter",
  "sauce",
  "observatory",
  "password",
  "century",
  "bookend",
  "drawback",
  "fabric",
  "siesta",
  "aristocrat",
  "addendum",
  "rainwater",
  "barber",
  "scream",
  "glitter",
  "archaeologist",
  "loiterer",
  "positive",
  "dizzy",
  "czar",
];

export const getThreeRandomWords = (wordsList: string[]) => {
  const wordsListLength = wordsList.length;
  const theeRandomWords: string[] = [];
  while (theeRandomWords.length < 3) {
    if (
      !theeRandomWords.includes(
        wordsList[Math.floor(Math.random() * wordsListLength)]
      )
    ) {
      theeRandomWords.push(
        wordsList[Math.floor(Math.random() * wordsListLength)]
      );
    }
  }
  return theeRandomWords;
};
