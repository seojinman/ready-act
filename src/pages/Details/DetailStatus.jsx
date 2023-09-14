import {pb} from '@/api/pocketbase';
import Spinner from '@/components/Spinner';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import StatusIcon from './StatusIcon';

function DetailStatus() {
  const {id} = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    async function detailProgress() {
      try {
        const getStatus = await pb.collection('products').getOne(id);
        setData(getStatus);
      } catch (error) {
        throw new Error(error);
      }
    }

    detailProgress();
  }, [id]);

  if (data) {
    return (
      <>
        {data.status === '대기중' ? (
          <div className="flex">
            <StatusIcon color="#EBF8E8" textColor="#30B66E" text="대기중" />
            <StatusIcon text="진행중" />
            <StatusIcon text="종 료" textX="30%" textY="64%" />
          </div>
        ) : data.status === '진행중' ? (
          <div className="flex">
            <StatusIcon text="대기중" />
            <StatusIcon color="#EBF8E8" textColor="#30B66E" text="진행중" />
            <StatusIcon text="종 료" textX="30%" textY="64%" />
          </div>
        ) : (
          <div className="flex">
            <StatusIcon text="대기중" />
            <StatusIcon text="진행중" />
            <StatusIcon
              color="#EBF8E8"
              textColor="#30B66E"
              text="종 료"
              textX="30%"
              textY="64%"
            />
          </div>
        )}
      </>
    );
  } else {
    <Spinner />;
  }
}

export default DetailStatus;
