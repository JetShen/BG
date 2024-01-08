import '@/styles/notifications.css'
import Alert from '@/component/alert'

export default function Notifications(){
    return (
        <>
        <div className="headOptions">
            <h4>Notifications</h4>
            <button>Settings</button>
        </div>
        <div className="Notifications">
            <Alert />
        </div>
        </>
    )
}