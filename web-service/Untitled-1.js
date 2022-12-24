app.put("/updateTempat", upload.single("gambar"), (req, res) =>{
    let nama_ekspedisi  = req.body.nama_ekspedisi;
    let nama_tempat = req.body.nama_tempat;
    let lokasi= req.body.lokasi;
    let kota = req.body.kota;
    let provinsi = req.body.provinsi;
    let kode_pos = req.body.kode_pos;
    let koordinat = req.body.koordinat;
    let gambar = req.file.filename;
    let keterangan_gambar = req.body.keterangan_gambar;
    let id_tempat = req.body.id_tempat;

    let viewgambar;
    fileUrl = gambar.replaceAll(" ", "%20");
    viewgambar = req.protocol + "://" + req.get("host") + "/" + fileUrl;

    const sqlQuery = `UPDATE public.tempat SET nama_ekspedisi = '${nama_ekspedisi}', nama_tempat = '${nama_tempat}', lokasi = '${lokasi}', kota = '${kota}', provinsi = '${provinsi}', kode_pos = '${kode_pos}', koordinat = ST_GeomFromText('POINT(${koordinat})', 4326), gambar = '${gambar}', keterangan_gambar = '${keterangan_gambar}' WHERE id_tempat = '${id_tempat}'`;
    db.query(sqlQuery, (err, result) =>{
        if (err) {
            return res.status(500).json({
                message: "Ada kesalahan",
                error: err,
            });
        }
        else{
            return res.json({
                id_tempat: id_tempat,
                gambar: gambar,
                viewgambar: viewgambar

            })
        }
    });
});