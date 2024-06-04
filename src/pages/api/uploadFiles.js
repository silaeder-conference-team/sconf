import formidable from "formidable";
import fsPromises from "fs/promises";
import path from "path";
import fsExists from "fs.promises.exists";

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    await form.parse(req, async function (err, fields, files) {
        await saveFile(files.file, fields.type, fields.id);
        return res.status(201).send("");
    });
};

const saveFile = async (file, type, id) => {
    console.log(file);
    console.log(file.originalFilename);
    if (fsExists(`./public/${type}/${id}${path.extname(file.originalFilename)}`)) {
        try {
            const data = await fsPromises.readFile(file.filepath);
            await fsPromises.writeFile(`./public/${type}/${id}${path.extname()}`, data);
            
            await fsPromises.unlink(file.filepath);
        } catch (e) {
            console.log(e)
        }
    } else {
        try {
            const data = await fsPromises.readFile(file.filepath);
            await fsPromises.unlink(`./public/${type}/${id}${path.extname(file.originalFilename)}`);
            await fsPromises.writeFile(`./public/${type}/${id}${path.extname(file.originalFilename)}`, data);
            await fsPromises.unlink(file.filepath);
        } catch (e) {
            console.log(e)
        }
    }
    return 'ok';
};

export default (req, res) => {
    req.method === "POST"
        ? post(req, res)
        : req.method === "PUT"
            ? console.log("PUT")
            : req.method === "DELETE"
                ? console.log("DELETE")
                : req.method === "GET"
                    ? console.log("GET")
                    : res.status(404).send("");
};