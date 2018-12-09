import React from 'react';
import _ from 'lodash';
import axios from 'axios';

class OrderCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.props.data;

        this.setOrderStatus = this.setOrderStatus.bind(this);
    }

    // Fonction executée lorsque l'utilisateur valide ou refuse une commande
    setOrderStatus(event, status) {
        event.preventDefault();

        if(status === 'validated') {
            axios.post('/orders/accept', {...this.props.data})
            .then(response => {
                this.setState({status: 'validated'});
            })
            .catch(error => console.error(error))
        } else {
            axios.post('/orders/reject', {...this.props.data})
            .then(response => {
                this.setState({status: 'rejected'});
            })
            .catch(error => console.error(error))
        }
    }

    render() {

        let controlComponent = null;

        // Choix du composant à afficher en fonction du statut d'une commande
        if (_.isNil(this.state.status)) {
            controlComponent = (
                <div>
                    <button type="button" className="btn btn-success" onClick={(event) => this.setOrderStatus(event, 'validated')}>Accepter</button>
                    <button type="button" className="btn btn-danger" onClick={(event) => this.setOrderStatus(event, 'rejected')}>Refuser</button>
                </div>
            );
        } else {
            if(this.state.status === 'validated') {
                controlComponent = <button type="button" className="btn btn-success" disabled>Commande Acceptée</button>
            } else {
                controlComponent = <button type="button" className="btn btn-danger" disabled>Commande Refusée</button>
            }
        }

        return (
            <div className="row">
                <div className="col-md">
                    <div className="card card-margin">
                        <div className="card-body">
                            <h5 className="card-title">{`Commande N° ${this.props.number}`}</h5>
                            <p className="card-text">{`Client : ${this.state.firstname} ${this.state.lastname}`}</p>
                            <p className="card-text">{`Adresse de livraison : ${this.state.address}`}</p>
                            <p className="card-text">{`Adresse Email : ${this.state.email}`}</p>
                            <p className="card-text">{`Téléphone : ${this.state.telephone}`}</p>
                            {controlComponent}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default OrderCard;