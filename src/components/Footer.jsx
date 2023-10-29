import '../styles/Footer.scss';

const Footer = () => {
  return (
    <footer className='footer-section'>
      <p className='copy-footer'>
        2023 &#169;{' '}
        <a
          href='https://www.linkedin.com/in/matias-vallejos-a10902260/'
          target='_blank'
          rel='noreferrer'
          className='linkedin-url'
        >
          {' '}
          Matias Vallejos
        </a>
        . All right reserved.
      </p>
    </footer>
  );
};
export default Footer;
