import { pb } from '@/api/pocketbase';
import logo from '@/assets/icons/logo.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import Backdrop from './Backdrop';
import { func } from 'prop-types';
// import styles from '@/styles/Dialog.module.css';
import Dialog from './Dialog';

function Participation({ onUpdateParticipation }) {
  const { id } = useParams();
  const opennerRef = useRef(null);
  const [open, setOpen] = useState(false);

  async function joinAsParticipant(productId, userId) {
    try {
      // productId와 userId를 사용하여 포켓호스트에 유저 정보 업데이트
      const record = await pb.collection('products').update(
        productId,
        {
          'participate+': userId,
        },
        {
          expand: 'participate',
        }
      );

      // 새로운 참여자 찾기
      const newParticipation = record.expand.participate.find(
        (item) => item.id === userId
      );

      // 새로운 참여자 추가 (상위 컴포넌트에서 상태 관리)
      onUpdateParticipation?.(newParticipation);
      // 업데이트가 성공하면 참여자 목록에 추가된 것입니다.
      console.log('참여자 목록에 사용자 추가 완료.');
    } catch (error) {
      console.error('유저 정보 업데이트 중 오류 발생:', error);
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // 탭키로 접근해서 닫을 때 오픈 버튼에 포커스 주기
    opennerRef.current.focus();
  };

  const handleJoin = async () => {
    // userId와 productId를 설정하세요.
    const userId = JSON.parse(localStorage.getItem('pocketbase_auth')).model.id;
    const productId = id; // 사용 중인 상품 ID를 사용
    await joinAsParticipant(productId, userId);
    handleClose(); // 모달 닫기
  };

  return (
    <div className="App">
      <motion.button
        type="button"
        ref={opennerRef}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleOpen}
        className="w-28 h-11 bg-primary-500 rounded-xl text-white hover:bg-primary-700 ml-52"
      >
        참여하기
      </motion.button>

      <AnimatePresence>

        {open && (
          <div className='fixed top-0 left-0 w-screen h-full z-10 bg-[#15151582]'> 
          <Dialog type="rotate" onClose={handleClose}>
            <div className='flex flex-col fixed z-50 top-[500px] left-1/2 w-[clamp(300px, 96vw, 840px)] h-[clamp(300px, 96vh, 700px)] border border-[#b9b9b956] rounded-12 bg-white bg-no-repeat bg-center bg-cover transform -translate-x-1/2 -translate-y-1/2 rounded-xl p-8'>
            <Dialog.Head>
              <h3 className="flex justify-center items-center">RO9M</h3>
            </Dialog.Head>
            <Dialog.Body>
              <div className="text-primary-500 flex flex-1 justify-center items-center">
                <img src={logo} alt="로고" className="mx-auto w-10 h-10" />
              </div>
                <div className="text-center block text-primary-500 mb-3">참여하시겠습니까?</div>
            </Dialog.Body>
                  <Dialog.Foot>
              <div className='flex'>
              <button
                type="button"
                onClick={handleClose}
                className="w-16 h-9 bg-greenishgray-600 rounded-xl p-1 hover:bg-greenishgray-800 text-sm text-white"
                >
                돌아가기
              </button>
              <div className='pl-4'>
              <button
                type="button"
                onClick={handleJoin}
                className="w-24 h-9 bg-primary-500 rounded-xl p-1 hover:bg-primary-700 text-sm text-white"
                >
                네, 참여할래요
              </button>
                  </div>
                </div>
                  </Dialog.Foot>
                  
            <Dialog.CloseButton onClose={handleClose}/>
            </div>
          </Dialog>
        </div>
        )}
      </AnimatePresence>
    </div>
  );
}

Participation.propTypes = {
  onUpdateParticipation: func,
};

export default Participation;
