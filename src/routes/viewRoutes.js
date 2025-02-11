import { Router } from 'express';
import fs from 'fs';
const viewsRouter = Router();

const getProductsFromFile = () => {
try {
    const data = fs.readFileSync('products.json', 'utf-8');
    return JSON.parse(data);
} catch (err) {
    return [];
}
};

viewsRouter.get('/', (req, res) => {
const productos = getProductsFromFile();
res.render('home', { productos });
});


viewsRouter.get('/realtimeproducts', (req, res) => {

res.render("realtimeproducts");
});



export default viewsRouter;
