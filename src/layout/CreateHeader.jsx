import {Link} from 'react-router-dom';
import close from '@/assets/icons/close.svg';

function CreateHeader({...restProps}) {
  return (
    <div className="relative border-b-2 line-400">
      <p className="text-center py-4">방만들기</p>

      <Link to="/home">
        <img
          src={close}
          alt="닫기"
          className=" absolute top-4"
          {...restProps}
        />
      </Link>
    </div>
  );
}

export default CreateHeader;
