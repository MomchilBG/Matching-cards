import { useEffect } from 'react';
import './Modal.css';

export default function Modal(props) {
  useEffect(() => {
    document.querySelector('#modal-background').style.display = 'block';
    return () => {
      document.querySelector('#modal-background').style.display = 'none';
    };
  }, []);

  return <dialog>{props.children}</dialog>;
}
