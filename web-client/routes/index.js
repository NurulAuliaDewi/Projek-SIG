var express = require('express');
var router = express.Router();
const axios = require('axios');
// const { response } = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home')
});

router.get('/home', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/detailTempat',
  })
    .then(function (response) {
      console.log(response.data);
      res.render('home', {datas:response.data})
    });
});

//edit profile
router.get('/edit_profile', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/api/readUser/Nadaulia',
  })
    .then(function (response) {
      res.render('edit_profile', response.data[0]);
      
      console.log(response.data);
    });
  
});

//profile
router.get('/user_info', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/api/readUser/Nadaulia',
  })
    .then(function (response) {
      console.log(response.data[0]);
      res.render('user_info', response.data[0] );
      
      // console.log(response.data)
    });
  
});

//cek session
// router.get('/sessionid', (req, res)=>{
//   res.send(req.session.id)
// })

//login
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', function(req, res, next) {
  axios({
    method: 'post',
    url: 'http://localhost:3100/api/loginUser',
    data: req.body,
  })
    .then(function (response) {
      console.log(response.data);
      res.redirect('/home')
    });
  });

//register
router.get('/registrasi', function(req, res, next) {
  res.render('registrasi');
});
router.post('/registrasi', function(req, res, next) {
  console.log(req.body)
  axios({
    method: 'post',
    url: 'http://localhost:3100/createUser',
    data: req.body
  })
    .then(function (response) {
      console.log(response.data);
      res.redirect("login")
    });
});

//upload foto tempat
router.get('/tambah_foto', function(req, res, next) {
  res.render('tambah_foto');
});

//detail tempat
router.get('/detail/:id_tempat', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/detailTempat/' + req.params.id_tempat,
  })
    .then(function (response) {
      console.log(response.data);
      res.render('detail', response.data[0])
    });

});

//detail tempat
router.get('/edit/:id_tempat', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/detailTempat/' + req.params.id_tempat,
  })
    .then(function (response) {
      console.log(response.data);
      res.render('edit', response.data[0])
    });

})

//edit detail tempat
router.post('/edit', function(req, res, next) {
  console.log(req.body)
  axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: 'post',
    url: 'http://localhost:3100/updateTempat',
    data: req.body
  })
    .then(function (response) {
      console.log(response.data);
      res.render('detail', response.data[0])
    });
});


//halaman informasi
router.get('/halaman_informasi', function(req, res, next) {
  axios({
    method: 'get',
    url: 'http://localhost:3100/detailTempat',
  })
    .then(function (response) {
      console.log(response.data);
      res.render('halaman_informasi', {datas:response.data})
    });
});

//tag lokasi
router.get('/tag_lokasi', function(req, res, next) {
  res.render('tag_lokasi');
});
router.post('/tag_lokasi', function(req, res, next) {
  const lokasi = req.body.lokasi;
  const nama_ekspedisi = req.body.nama_ekspedisi;
  const koordinat = req.body.koordinat;
  res.redirect(`input_detail/${koordinat}/${nama_ekspedisi}/${lokasi}`);
});

//input detail
router.get('/input_detail/:koordinat/:nama_ekspedisi/:lokasi', function(req, res, next) {
  // const lokasi = req.body.lokasi;
  const nama_ekspedisi = req.params.nama_ekspedisi;
  const lokasi = req.params.lokasi;
  const koordinat = req.params.koordinat;
  console.log(lokasi)
  console.log(nama_ekspedisi)
  console.log(koordinat);
  res.render('input_detail', req.params);
});
router.post('/input_detail', function(req, res, next) {
  console.log(req.body)
  axios({
    method: 'post',
    url: 'http://localhost:3100/createTempat',
    data: req.body
  })
    .then(function (response) {
      console.log(response.data);
      res.redirect(`/halaman_informasi`);
    });
});

//delete
router.get('/delete/:id_tempat', (req, res) => {
  console.log(req.params.id_tempat)
  axios({
    method: 'get',
    url: 'http://localhost:3100/deleteTempat/' + req.params.id_tempat,
  })
    .then(function (response) {
      console.log(response.data);
      res.redirect("/halaman_informasi")
    });
})

//awal aplikasi 
router.get('/welcome', function(req, res, next) {
  res.render('welcome');
});

module.exports = router;

