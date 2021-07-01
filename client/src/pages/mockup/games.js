const gamesMockup = [
  {
    id: 1,
    teamA: {
      name: "france",
      betValue: 20,
      score: null,
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
    },
    teamB: {
      name: "italie",
      betValue: 30,
      score: null,
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
    },
    draw: {
      name: "NULL",
      betValue: 15,
    },
    competition: {
      name: "Eurocup",
    },
    playTime: null,
    gameStatus: "INCOMING",
    datetime: 1623760046200,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
    media:
      "https://www.leparisien.fr/resizer/D0crrN_z4i0JO15aafuhdjcRHEM=/932x582/arc-anglerfish-eu-central-1-prod-leparisien.s3.amazonaws.com/public/R54W6BQLVACG4DKQOE3KHNOBII.jpg",
  },
  {
    id: 2,
    teamA: {
      name: "allemagne",
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
      betValue: 15,
      score: 2,
    },
    teamB: {
      name: "suède",
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
      betValue: 15,
      score: 1,
    },
    draw: {
      name: "NULL",
      betValue: 15,
    },
    competition: {
      name: "Eurocup",
    },
    playTime: 120,
    gameStatus: "ENDED",
    datetime: 1623760046200,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRqTkEkYtDLv5AaAbJ8ayVvWrypva3eOAGr3ctLUwfNZHxu3eQEcHnFliJ7vFtGAhdkU&usqp=CAU",
  },
  {
    id: 3,
    teamA: {
      name: "espagne",
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
      betValue: 15,
      score: 0,
    },
    teamB: {
      name: "portugal",
      shield: "https://image.flaticon.com/icons/png/512/197/197560.png",
      betValue: 15,
      score: 0,
    },
    draw: {
      name: "NULL",
      betValue: 15,
    },
    competition: {
      name: "Eurocup",
    },
    playTime: null,
    gameStatus: "PLAYING",
    datetime: 1623760046200,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae mollitia accusantium expedita eligendi nulla eius molestiae neque? Quod repudiandae ipsa repellendus accusantium dignissimos alias, ab sed, sapiente asperiores, ducimus numquam.",
    media:
      "https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg):focal(1422x294:1424x292)/origin-imgresizer.eurosport.com/2021/06/03/3145541-64466548-2560-1440.jpg",
  },
];

export { gamesMockup };
