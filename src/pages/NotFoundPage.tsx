import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui'

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={<Compass size={40} />}
      title="항로를 벗어났습니다"
      desc="요청한 페이지가 없습니다. 홈으로 돌아가 항해 지도를 다시 확인하세요."
      action={
        <Link to="/" className="btn-primary">
          홈으로
        </Link>
      }
    />
  )
}
