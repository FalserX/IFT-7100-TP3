"use client"
import {connect} from "../../services/wallet"

const ButtonLogin = () => {
    return (
        <button onClick={connect}>
            Veuillez cliquer ici pour vous connecter
        </button>
    )
}


export default ButtonLogin;