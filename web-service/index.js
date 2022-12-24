const port = 3100;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./model/dbConnection');
const {
    request,
    response
} = require('express');
const multer = require('multer');
const app = express()

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './foto/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});
const upload = multer({
    storage: fileStorageEngine
});

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors('*'));
app.use(express.static(path.join(__dirname, 'foto')));


//read db user
app.get("/Data", (req, res) => {
    const sqlQuery = 'Select * from "pengguna"';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            res.send(result.rows);
            // console.log(result.rows);
        }
    });
});

//create akun user (register)
app.post("/createUser", (req, res) => {
    const nama_pengguna = req.body.nama_pengguna;
    const username_pengguna = req.body.username_pengguna;
    const email_pengguna = req.body.email_pengguna;
    const password_pengguna = req.body.password_pengguna;
    const nippos = req.body.nippos;

    const sqlQuery = `INSERT INTO pengguna(nama_pengguna, username_pengguna, email_pengguna, password_pengguna, nippos) VALUES ('${nama_pengguna}', '${username_pengguna}', '${email_pengguna}', '${password_pengguna}', '${nippos}')`;
    // console.log (sqlQuery);
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            res.send(result);
            console.log(result);
        }
    });
});


//login akun
app.post("/api/loginUser", (req, res) => {
    const userName = req.body.username_pengguna;
    const userPassword = req.body.user_password;
    const sqlQuery = `SELECT * FROM public.pengguna WHERE username_pengguna = '${userName}' AND password_pengguna = '${userPassword}'`;

    db.query(sqlQuery, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }

        if (rows.length < 1) {
            return res.status(404).json({
                message: "login gagal periksa kembali email dan password",
                methode: req.method,
                url: req.url,
            });
        }

        res.json({
            status: "OK",
            message: "login berhasil",
            data: rows,
            methode: req.method,
            url: req.url,
        });
    });
});

//read user by username
app.get('/api/readUser/:username_pengguna', (req, res) => {
    const userName = req.params.username_pengguna;

    const sqlQuery = `SELECT id_pengguna, nama_pengguna, username_pengguna, email_pengguna, password_pengguna, nippos, foto_pengguna FROM public.pengguna WHERE username_pengguna = '${userName}'`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            let fileUrl;
            let response = result.rows
            response.forEach(data => {
                if (data.foto_pengguna) {
                    fileUrl = data.foto_pengguna;
                    fileUrl = fileUrl.replaceAll(" ", "%20");
                    // console.log(fileUrl);

                    data.foto_pengguna = req.protocol + "://" + req.get("host") + "/" + fileUrl;
                }
                else{
                    data.foto_pengguna = req.protocol + "://" + req.get("host") + "/no_image.png";
                }
            });
            res.send(response);
        }
    });
});

//update profile
app.post("/updateProfile", upload.single("gambar"), (req, res) => {
    // console.log(req.body)
    let nama_pengguna = req.body.nama_pengguna;
    let email_pengguna = req.body.email_pengguna;
    let password_pengguna = req.body.password_pengguna;
    let username_pengguna = req.body.username_pengguna;
    let sqlQuery;
    let liatgambar;

    if (req.file) {
        let foto_pengguna = req.file.filename;
        // console.log(foto_pengguna)
        fileUrl = foto_pengguna.replaceAll(" ", "%20");
        liatgambar = req.protocol + "://" + req.get("host") + "/" + fileUrl;
        sqlQuery = `UPDATE public.pengguna SET nama_pengguna = '${nama_pengguna}', email_pengguna = '${email_pengguna}', password_pengguna = '${password_pengguna}', foto_pengguna = '${foto_pengguna}' WHERE username_pengguna = '${username_pengguna}'`;
        // console.log(sqlQuery)
    } else {
        sqlQuery = `UPDATE public.pengguna SET nama_pengguna = '${nama_pengguna}', email_pengguna = '${email_pengguna}', password_pengguna = '${password_pengguna}' WHERE username_pengguna = '${username_pengguna}'`;
        console.log(sqlQuery)
    }

    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            if (req.file) {
                return res.json({
                    message: "Detail berhasil diperbarui",
                    nama_pengguna: nama_pengguna,
                    email_pengguna: email_pengguna,
                    password_pengguna: password_pengguna,
                    username_pengguna: username_pengguna,
                    foto_pengguna: liatgambar,
                });
            } else {
                return res.json({
                    message: "Berhasil, gambar tdak diperbarui",
                    nama_pengguna: nama_pengguna,
                    email_pengguna: email_pengguna,
                    password_pengguna: password_pengguna,
                    username_pengguna: username_pengguna,
                });
            }
        }
    });
});

//get detail tempat
app.get("/detailTempat", (req, res) => {
    const sqlQuery = `SELECT id_tempat, nama_tempat, lokasi, kota, provinsi, gambar, ST_AsText(koordinat) AS koordinat, nama_ekspedisi, kode_pos, keterangan_gambar FROM public.tempat`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            db.query(sqlQuery, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Ada kesalahan",
                        error: err,
                    });
                } else {
                    let fileUrl;
                    let response = result.rows
                    response.forEach(data => {
                        if (data.gambar) {
                            fileUrl = data.gambar;
                            fileUrl = fileUrl.replaceAll(" ", "%20");
                            // console.log(fileUrl);

                            data.gambar = req.protocol + "://" + req.get("host") + "/" + fileUrl;
                        }
                        else{
                            data.gambar = req.protocol + "://" + req.get("host") + "/no_image.png";
                        }
                    });
                    res.send(response);
                    // console.log(response)
                }
            });
            // res.send(result.rows);
            // console.log(result.rows);
        }
    });
});


//get tempat by id
app.get('/detailTempat/:id_tempat', (req, res) => {
    const id_tempat = req.params.id_tempat;

    const sqlQuery = `SELECT id_tempat, nama_tempat, lokasi, kota, provinsi, gambar, ST_AsText(koordinat) AS koordinat, nama_ekspedisi, kode_pos, keterangan_gambar
    FROM public.tempat WHERE id_tempat = '${id_tempat}'`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            let fileUrl;
            let response = result.rows
            response.forEach(data => {
                if (data.gambar) {
                    fileUrl = data.gambar;
                    fileUrl = fileUrl.replaceAll(" ", "%20");
                    // console.log(fileUrl);

                    data.gambar = req.protocol + "://" + req.get("host") + "/" + fileUrl;
                }
                else{
                    data.gambar = req.protocol + "://" + req.get("host") + "/no_image.png";
                }
            });
            res.send(response);
        }
    });
});

//get lokasi
app.get("/tempat", (req, res) => {
    db.query(
        `SELECT JSONB_BUILD_OBJECT('type', 'FeatureCollection','features', JSON_AGG(features.feature)) 
            FROM (
              SELECT row_to_json(inputs) As feature 
                 FROM (SELECT 'Feature' As type 
                 , ST_AsGeoJSON(k.koordinat)::json As geometry 
                 , row_to_json((SELECT k FROM (SELECT id_tempat, nama_tempat, lokasi, kota, provinsi, gambar, koordinat, nama_ekspedisi, kode_pos) As k)) As properties 
                 FROM public.tempat As k WHERE k.koordinat is not NULL) As inputs
            ) features
        `, (error, results) => {
            if (error) {
                throw error
            }
            return res.json(results.rows[0]["jsonb_build_object"])
        })
});

//upload tempat
app.post("/createTempat", (req, res) => {
    const nama_ekspedisi = req.body.nama_ekspedisi;
    const nama_tempat = req.body.nama_tempat;
    const lokasi = req.body.lokasi;
    const kota = req.body.kota;
    const provinsi = req.body.provinsi;
    const kode_pos = req.body.kode_pos;
    const koordinat = req.body.koordinat;
    const sqlQuery = `INSERT INTO public.tempat(nama_ekspedisi, nama_tempat, lokasi, kota, provinsi, kode_pos, koordinat) VALUES('${nama_ekspedisi}', '${nama_tempat}', '${lokasi}', '${kota}', '${provinsi}', '${kode_pos}', ST_GeomFromText('POINT(${koordinat})', 4326))`;
    // console.log(sqlQuery)
    db.query(sqlQuery, (error, results) => {
        if (error) {

            console.log(results)
            throw error
        }
        res.status(201).send(`Berhasil menambahkan tempat`)
    })
});

//update tempat
app.post("/updateTempat", upload.single("gambar"), (req, res) => {
    // console.log(req.body)
    let nama_ekspedisi = req.body.nama_ekspedisi;
    let nama_tempat = req.body.nama_tempat;
    let lokasi = req.body.lokasi;
    let kota = req.body.kota;
    let provinsi = req.body.provinsi;
    let kode_pos = req.body.kode_pos;
    let koordinat = req.body.koordinat;
    let keterangan_gambar = req.body.keterangan_gambar;
    let id_tempat = req.body.id_tempat;
    let sqlQuery;
    let viewgambar;

    if (req.file) {
        let gambar = req.file.filename;
        fileUrl = gambar.replaceAll(" ", "%20");
        viewgambar = req.protocol + "://" + req.get("host") + "/" + fileUrl;
        sqlQuery = `UPDATE public.tempat SET nama_ekspedisi = '${nama_ekspedisi}', nama_tempat = '${nama_tempat}', lokasi = '${lokasi}', kota = '${kota}', provinsi = '${provinsi}', kode_pos = '${kode_pos}', koordinat = ST_GeomFromText('${koordinat}', 4326), gambar = '${gambar}', keterangan_gambar = '${keterangan_gambar}' WHERE id_tempat = '${id_tempat}'`;
        // console.log(sqlQuery)
    } else {
        sqlQuery = `UPDATE public.tempat SET nama_ekspedisi = '${nama_ekspedisi}', nama_tempat = '${nama_tempat}', lokasi = '${lokasi}', kota = '${kota}', provinsi = '${provinsi}', kode_pos = '${kode_pos}', koordinat = ST_GeomFromText('${koordinat}', 4326), keterangan_gambar = '${keterangan_gambar}' WHERE id_tempat = '${id_tempat}'`;
        // console.log(sqlQuery)
    }

    db.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        } else {
            if (req.file) {
                return res.json({
                    message: "Detail berhasil diperbarui",
                    nama_tempat: nama_tempat,
                    lokasi: lokasi,
                    kota: kota,
                    provinsi: provinsi,
                    kode_pos: kode_pos,
                    koordinat: koordinat,
                    gambar: viewgambar,
                    id_tempat: id_tempat,
                });
            } else {
                return res.json({
                    message: "Berhasil, gambar tdak diperbarui",
                    nama_tempat: nama_tempat,
                    lokasi: lokasi,
                    kota: kota,
                    provinsi: provinsi,
                    kode_pos: kode_pos,
                    koordinat: koordinat,
                    id_tempat: id_tempat,
                });
            }
        }
    });
});

// get search (alamat lokasi)
app.get("/readLokasi", (req, res) => {
    let tampil =[];
    const terms = req.query.term;
    console.log(terms)
    const sqlQuery = `SELECT * FROM public.tempat WHERE lokasi LIKE '%${terms}%'`;
        console.log(sqlQuery);
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.log(err)
               
            }else {
                let responses = result.rows;
                responses.forEach(e => {
                    let {id_tempat, lokasi}=e;
                    tampil.push({value: id_tempat, label: lokasi})

                })
                res.json(tampil);
                console.log(tampil)
            }
        });
    });

//delete tempat
app.get("/deleteTempat/:id_tempat", (request, response) => {
    const id_tempat = parseInt(request.params.id_tempat)
    // console.log(id_tempat);

    db.query('DELETE FROM public.tempat WHERE id_tempat = $1', [id_tempat], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id_tempat}`)
    });
});

app.get("/auto-complate", (req, res) => {
    let tampil =[];
    const terms = req.query.term;
    console.log(terms)
    const sqlQuery = `SELECT * FROM public.tempat WHERE nama_tempat LIKE '%${terms}%'`;
        console.log(sqlQuery);
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.log(err)
               
            }else {
                let responses = result.rows;
                responses.forEach(e => {
                    let {id_tempat, nama_tempat}=e;
                    tampil.push({value: id_tempat, label: nama_tempat})

                })
                res.json(tampil);
                console.log(tampil)
            }
        });
    });




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})