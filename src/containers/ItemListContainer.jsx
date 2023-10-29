import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import ItemList from "../components/ItemList.jsx";
import CoverPage from "../components/CoverPage.jsx";
import loadingGif from "../assets/img/loading.gif";
import "../styles/Main.scss";
import "../styles/ProductList.scss";

const ItemListContainer = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoriaId } = useParams();

  useEffect(() => {
    const querydb = getFirestore();
    const queryCollection = collection(querydb, "productos");
    const queryFilter = categoriaId
      ? query(queryCollection, where("categoria", "==", categoriaId))
      : queryCollection;

    getDocs(queryFilter)
      .then((resp) =>
        setProductos(resp.docs.map((item) => ({ id: item.id, ...item.data() })))
      )
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [categoriaId]);

  return (
    <>
      <CoverPage />
      {loading ? (
        <div id="spinner" className="container-loading">
          <img src={loadingGif} className="gif" alt="loading" />
        </div>
      ) : (
        <ItemList productos={productos} />
      )}
    </>
  );
};

// SIN FIRESTORE
// useEffect(()=> {
//     if(categoriaId){
//         getProducts// funcion que simula una api
//         // .then(resp =>{
//         //     //throw new Error('ESto es un error')//instanciando un error
//         //     console.log(resp)
//         //     return resp
//         // })

//         .then(resp => setproductos(resp.filter (item => item.categoria === categoriaId)) )
//         .catch(err => console.log(err))
//         .finally(()=>setLoading(false))
//     }else{
//         getProducts// funcion que simula una api
//         // .then(resp =>{
//         //     //throw new Error('ESto es un error')//instanciando un error
//         //     console.log(resp)
//         //     return resp
//         // })

//         .then(resp => setproductos(resp))
//         .catch(err => console.log(err))
//         .finally(()=>setLoading(false))
//     }
// }, [categoriaId]);
// const getProductsFromDB = async () => {
//     try {
//         const result = await getProducts;
//         setproductos(result);
//     }catch(error){
//         console.log(error);
//         alert('No podemos mostrar los productos en este momento');
//     }
// };
// useEffect( ()=>{
//     getProductsFromDB()
// }, [])

export default ItemListContainer;
