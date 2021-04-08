const mongoose = require('mongoose');
const addresses = require('./addresses');
const {descriptors, names} = require('./seedHelpers')
const Business = require('../models/business');


mongoose.connect('mongodb://localhost:27017/local-business', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Business.deleteMany({});
  for(let i = 0; i < 100; i++){
    const business = new Business({
      addedBy: '60548dab52a132e0d868b782',
      title: `${sample(descriptors)} ${sample(names)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1617891157/LocalBusiness/wchztrxrpatognyjnv6g.jpg',
          filename: 'LocalBusiness/wchztrxrpatognyjnv6g'
        },
        {
          url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1617891168/LocalBusiness/ftretcqeipro8gfzvq3z.jpg',
          filename: 'LocalBusiness/ftretcqeipro8gfzvq3z'
        },
        {
          url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1617891201/LocalBusiness/ojim32nxdxkfr9hbxpez.jpg',
          filename: 'LocalBusiness/ojim32nxdxkfr9hbxpez'
        },
        {
          url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1617891203/LocalBusiness/hr5twemuz50rjgkzhy7t.jpg',
          filename: 'LocalBusiness/hr5twemuz50rjgkzhy7t'
        }
      ],
    
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam non dolor modi. Eos cum maxime ipsa laborum, animi numquam cupiditate inventore similique voluptatem blanditiis minima recusandae praesentium, distinctio, adipisci autem!',
      location: {
        address: addresses[i].address,
        town: addresses[i].town,
        county: addresses[i].county,
        postcode: addresses[i].postcode,
      }
    })
    await business.save();
  }
  
};


// const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 300; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const price = Math.floor((Math.random() * 30) + 10);
//         const camp = new Campground({
//             author: '6009926a6b612e4fdb9e3183',
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`,
//             description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta quis optio sapiente possimus quam saepe suscipit incidunt natus fugit quidem doloribus harum quo, eaque debitis nostrum odit culpa. Eligendi, quasi.',
//             price,
//             geometry: {
//               type: 'Point',
//               coordinates: [
//                 cities[random1000].longitude,
//                 cities[random1000].latitude,
//             ]
//             },
//             images: [
//                 {
//                   url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1611747667/YelpCamp/ta4j0toov2ftm5csjzi2.jpg',
//                   filename: 'YelpCamp/ta4j0toov2ftm5csjzi2'
//                 },
//                 {
//                   url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1611747668/YelpCamp/jotrg2af7jmo2poxoinf.jpg',
//                   filename: 'YelpCamp/jotrg2af7jmo2poxoinf'
//                 },
//                 {
//                   url: 'https://res.cloudinary.com/dtyeth4uh/image/upload/v1611747670/YelpCamp/apjmnblmslsiddmb7yua.jpg',
//                   filename: 'YelpCamp/apjmnblmslsiddmb7yua'
//                 }
//               ]
              
//         })
//         await camp.save();
//     }
// }

seedDB().then(() => mongoose.connection.close())