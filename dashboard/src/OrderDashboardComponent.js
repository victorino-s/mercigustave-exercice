import React from 'react';
import axios from 'axios';
import OrderCard from './OrderCard';
import _ from 'lodash';

class OrderDashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            orders: null,
            errorOccured: false
        };
    }

    componentDidMount() {
        const self = this;

        // Récupération des commandes lorsque le composant est monté
        axios.get('/orders')
            .then(function (response) {
                // handle success
                if (_.isNil(response.data.status)) {
                    // success
                    // mise à jour du state
                    self.setState({
                        isLoading: false,
                        orders: response.data,
                        errorOccured: false
                    });
                } else {
                    // error
                    console.error("Error trying to fetch server : ", response.data.error);
                    self.setState({
                        isLoading: false,
                        errorOccured: true
                    });
                }
            }).catch(error => {
                console.error("Error trying to fetch server : ", error);
                self.setState({
                    isLoading: false,
                    errorOccured: true
                });
            });
    }

    render() {

        let renderComponent = null;

        // Choix du composant à afficher en fonction du state
        if (this.state.isLoading) {
            renderComponent = <h4>Loading...</h4>;
        } else {
            if (this.state.errorOccured) {
                renderComponent = <h4>Une erreur est survenue :( Regardez les logs</h4>;
            } else {
                if (this.state.orders.length > 0) {
                    renderComponent = _.map(this.state.orders, (order, i) => {
                        return <OrderCard data={order} number={i+1} key={i} />
                    });
                } else {
                    renderComponent = <h4>Aucune commande passée...</h4>;
                }
            }
        }
        return (
            <div className="container orders-container">
                {renderComponent}
            </div>
        )
    }
}

export default OrderDashboardComponent;