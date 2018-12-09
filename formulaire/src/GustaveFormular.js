import React from 'react';
import _ from 'lodash';
import axios from 'axios';

class GustaveFormular extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deliveryAddress: "",
            addressExtraInfos: "",
            lastname: "",
            firstname: "",
            email: "",
            telephone: "",
            validEmail: true,
            validTelephone: true,
            isFormValid: true,
            isLoading: false,
            serverResponse: ''
        }

        this.handleInputChanged = this.handleInputChanged.bind(this);
        this.handleEmailChanged = this.handleEmailChanged.bind(this);
        this.handleTelephoneChanged = this.handleTelephoneChanged.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.sendForm = this.sendForm.bind(this);
    }

    handleInputChanged(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleEmailChanged(event) {
        this.setState({
            validEmail: this.verifyEmailValidity(event.target.value),
            email: event.target.value
        });
    }

    handleTelephoneChanged(event) {
        this.setState({
            validTelephone: this.verifyPhoneValidity(event.target.value),
            telephone: event.target.value
        });
    }

    verifyEmailValidity(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true);
        }
        return (false);
    }

    verifyPhoneValidity(num) {
        if (num.indexOf('+33') != -1) num = num.replace('+33', '0');
        var re = /^0[1-7]\d{8}$/;
        return re.test(num);
    }

    validateForm() {
        const requiredStringFields = ['deliveryAddress', 'lastname', 'firstname', 'email', 'telephone'];
        const stateSubset = _.pick(this.state, requiredStringFields);

        let validStringFields = 0;

        _.each(stateSubset, i => { if (i.length > 0) validStringFields++ });

        return validStringFields === requiredStringFields.length && this.state.validEmail && this.state.validTelephone;
    }

    sendForm(event) {
        event.preventDefault();

        if (this.validateForm()) {

            const orderData = {
                address: `${this.state.deliveryAddress}${this.state.addressExtraInfos.length > 0 ? ' - ' + this.state.addressExtraInfos : ''}`,
                lastname: this.state.lastname,
                firstname: this.state.firstname,
                email: this.state.email,
                telephone: this.state.telephone
            };

            axios.post('/orders', orderData)
                .then(res => {
                    if (res.data.status === "success") {
                        this.setState({
                            isLoading: false,
                            serverResponse: "Commande passée avec succès !",
                            deliveryAddress: "",
                            addressExtraInfos: "",
                            lastname: "",
                            firstname: "",
                            email: "",
                            telephone: "",
                            validEmail: true,
                            validTelephone: true,
                            isFormValid: true,
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            serverResponse: "Une erreur est survenue.",
                        });
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la commande : ", error);
                    this.setState({
                        isLoading: false,
                        serverResponse: "Une erreur est survenue.",
                    });
                })
        } else {
            this.setState({
                isFormValid: false
            });
        }
    }

    render() {
        return (
            <form>
                <div className="form-group">
                    <label>Adresse de livraison :</label>
                    <input type="text" className="form-control" placeholder="Adresse de livraison" id="deliveryAddress" onChange={this.handleInputChanged} value={this.state.deliveryAddress} />
                    <input type="text" className="form-control" placeholder="Information complémentaires." id="addressExtraInfos" onChange={this.handleInputChanged} value={this.state.addressExtraInfos} />
                </div>
                <div className="form-group">
                    <label>Identité :</label>
                    <input type="text" className="form-control" placeholder="Nom" id="lastname" onChange={this.handleInputChanged} value={this.state.lastname} />
                    <input type="text" className="form-control" placeholder="Prénom" id="firstname" onChange={this.handleInputChanged} value={this.state.firstname} />
                </div>
                <div className="form-group">
                    <label>Contacts :</label>
                    <input type="email" className={`form-control ${this.state.validEmail ? null : 'invalid-field'}`} placeholder="Email" id="email" onChange={this.handleEmailChanged} value={this.state.email} />
                    <input type="tel" className={`form-control ${this.state.validTelephone ? null : 'invalid-field'}`} placeholder="Téléphone" id="telephone" value={this.state.telephone} onChange={this.handleTelephoneChanged} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={this.state.isLoading} onClick={this.sendForm}>{`${this.state.isLoading ? 'Envoi...' : 'Envoyer'}`}</button>
                <small className={`${this.state.isFormValid ? 'hidden-element' : 'visible-warning-msg'}`}>Des informations sont manquantes !</small>
                <small className={`${this.state.serverResponse.length === 0 ? 'hidden-element' : 'visible-msg'}`}>{this.state.serverResponse}</small>
            </form>
        )
    }
}

export default GustaveFormular;