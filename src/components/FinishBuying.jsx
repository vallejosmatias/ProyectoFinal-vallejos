import { useContext, useState } from 'react';
import {
  addDoc,
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import AppContext from '../context/AppContext';
import useForm from '../hooks/useForm';
import { BiLoaderCircle } from 'react-icons/bi';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/Form.scss';

const initialForm = {
  name: '',
  surname: '',
  phone: '',
  email: '',
  emailr: '',
};
const validationsForm = (form) => {
  let errors = {};
  let errorMessages = [];
  let regexNameSurname = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexPhone =
    /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;

  if (!form.name.trim()) {
    errors.name = "El campo 'Nombre' es requerido";
    errorMessages.push(errors.name);
  } else if (!regexNameSurname.test(form.name.trim())) {
    errors.name = "El campo 'Nombre' solo acepta letras y espacios en blanco";
    errorMessages.push(errors.name);
  }
  if (!form.surname.trim()) {
    errors.surname = "El campo 'Apellido' es requerido";
    errorMessages.push(errors.surname);
  } else if (!regexNameSurname.test(form.surname.trim())) {
    errors.surname =
      "El campo 'Apellido' solo acepta letras y espacios en blanco";
    errorMessages.push(errors.surname);
  }
  if (!form.email.trim()) {
    errors.email = "El campo 'Email' es requerido";
    errorMessages.push(errors.email);
  } else if (!regexEmail.test(form.email.trim())) {
    errors.email = "El campo 'Email' es incorrecto";
    errorMessages.push(errors.email);
  }
  if (form.email !== form.emailr) {
    errors.emailr = 'Los campos Email no coinciden';
    errorMessages.push(errors.emailr);
  }
  if (!form.phone.trim()) {
    errors.phone = "El campo 'Celular' es requerido";
    errorMessages.push(errors.phone);
  } else if (!regexPhone.test(form.phone.trim())) {
    errors.phone = "El campo 'Celular' es incorrecto ";
    errorMessages.push(errors.phone);
  }

  if (errorMessages.length > 0) {
    toast.error(errorMessages.join('\n'));
  }
  return errors;
};

const FinishBuying = () => {
  const { state, totalPrice, emptyCart } = useContext(AppContext);
  const { form, errors, handleChange, handleBlur, setForm } = useForm(
    initialForm,
    validationsForm
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Función auxiliar para manejar el éxito al crear una orden
  const handleOrderSuccess = (resp) => {
    setLoading(false);
    setResponse(true);
    setForm(initialForm);
    setTimeout(() => setResponse(false), 4000);
    toast.success(`Tu compra ${resp.id} fue realizada con éxito`);
    setTimeout(() => emptyCart(), 4500);
    toast('¡Muchas gracias por tu compra!', {
      icon: '👏',
    });
  };
  // <-- GENERATE ORDER
  const generateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const order = {
      buyer: form,
      total: totalPrice(),
      items: state.map(({ id, nombre, precio, cantidad }) => ({
        id,
        name: nombre,
        price: precio * cantidad,
      })),
    };
    // Función auxiliar para manejar el éxito al crear una orden
    // creación de un documento
    const db = getFirestore();
    const queryCollection = collection(db, 'orders');
    await addDoc(queryCollection, order)
      .then((resp) => {
        handleOrderSuccess(resp);
      })
      .catch((err) => console.log(err));
    updateStock();
  };

  // UPDATE, MODIFICAR UN ARCHIVO

  // const queryUpdate =  doc(db, 'productos', '66jKSAod52FJ14UY4ShV')
  // updateDoc(queryUpdate, {
  //     stock : 50
  // })
  // .then(resp => console.log('actualizado'))

  // ACTUALIZAR STOCK DE DIFERENTES PRODUCTOS

  const updateStock = async (state, db) => {
    const queryCollectionStock = collection(db, 'productos');
    const queryUpdateStock = await query(
      queryCollectionStock,
      where(
        documentId(),
        'in',
        state.map((it) => it.id)
      )
    );

    const batch = writeBatch(db);
    await getDocs(queryUpdateStock).then((resp) =>
      resp.docs.forEach((res) =>
        batch.update(res.ref, {
          stock:
            res.data().stock -
            state.find((item) => item.id === res.id).cantidad,
        })
      )
    );
    batch.commit();
  };
  // GENERATE ORDER -->

  return (
    <section id='contact' className='contact'>
      <Toaster position='bottom-center' reverseOrder={false} />
      <div className='section-title'>
        <h2>Información del comprador</h2>
      </div>
      <div className='container'>
        <form onSubmit={generateOrder} className='contactForm'>
          <div className='form-container'>
            <input
              type='text'
              name='name'
              className='form-input'
              placeholder='Nombre(s) *'
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.name}
              required
            />
          </div>
          <div className='form-container'>
            <input
              type='text'
              name='surname'
              className='form-input'
              placeholder='Apellido(s) *'
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.surname}
              required
            />
          </div>
          <div className='form-container'>
            <input
              type='tel'
              className='form-input'
              name='phone'
              placeholder='Celular *'
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.phone}
              required
            />
          </div>
          <div className='form-container'>
            <input
              type='email'
              className='form-input'
              name='email'
              placeholder='Email *'
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.email}
              required
            />
          </div>
          <div className='form-container'>
            <input
              type='email'
              className='form-input'
              name='emailr'
              placeholder='Confirm Email *'
              onChange={handleChange}
              onBlur={handleBlur}
              value={form.emailr}
              required
            />
          </div>
          <span className='spanForm'>
            Usaremos tus datos para informarte sobre la entrega.
          </span>
          <button
            className='button-fw'
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading && <BiLoaderCircle />} Terminar mi compra
          </button>
        </form>
        {response && <Toaster position='bottom-center' />}
      </div>
    </section>
  );
};
export default FinishBuying;
