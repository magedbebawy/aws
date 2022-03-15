import React, { Component } from 'react';
import { Table, Button} from 'reactstrap';
import {faThumbsUp, faThumbsDown, faMoneyCheckAlt, faImage, faSearchDollar, faTh} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class App extends Component {

  state = {
    isLoading: false,
    invoices: [
      {
        "id": "100",
        "vendor": "Maged",
        "amount": "1800",
        "invoice": "12452",
        "date": "03/02/2022"
      },
      {
        "id": "101",
        "vendor": "Maged",
        "amount": "1800",
        "invoice": "12452",
        "date": "03/02/2022"
      },
      {
        "id": "102",
        "vendor": "Maged",
        "amount": "1800",
        "invoice": "12452",
        "date": "03/02/2022"
      },
    ]
  }

  remove(id) {
    let updatedInvoices = [...this.state.invoices].filter(i => i.id !== id);
    this.setState({invoices : updatedInvoices});
  }
  
  render() {
    const isLoading = this.state.isLoading;
    const allInvoices = this.state.invoices;

    let invoices = allInvoices.map(invoice => 
        <tr key={invoice.id}>
          <td>{invoice.vendor}</td>
          <td>{invoice.amount}</td>
          <td>{invoice.invoice}</td>
          <td>{invoice.date}</td>
          <td><Button className='btn btn-lg btn-success' onClick={() => this.remove(invoice.id)} ><FontAwesomeIcon icon={faThumbsUp}/>OK</Button></td>
          <td><Button className='btn btn-lg btn-danger' onClick={() => this.remove(invoice.id)}><FontAwesomeIcon icon={faThumbsDown}/>NOK</Button></td>
          <td><Button className='btn btn-lg btn-info' onClick={() => this.remove(invoice.id)} ><FontAwesomeIcon icon={faMoneyCheckAlt}/>%50</Button></td>
          <td><Button className='btn btn-lg btn-warning' onClick={() => this.remove(invoice.id)} ><FontAwesomeIcon icon={faSearchDollar}/>??</Button></td>
          <td><Button className='btn btn-lg btn-info' onClick={() => this.remove(invoice.id)} ><FontAwesomeIcon icon={faImage}/>Image</Button></td>
        </tr>
      )

    if(isLoading){
      return (
        <div>
          Loading ...
        </div>
      );
    }
    return (
     <div className='container border border-secondary rounded center'>
       <div className='row'>
         <div className='col-12'>
           <h4 className='text-center'>Pending Invoices - The Test Company</h4>
         </div>
       </div>
       <div className='row'>
         <div className='clo-xs-12 center text-center'>
           <Table striped dark responsive bordered hover>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Invoice #</th>
                <th>Date</th>
                <th colSpan='4'>Actions</th>
                <th>Image</th>
              </tr> 
            </thead>
            <tbody>
              {this.state.invoices.length === 0 ? <tr><td colSpan='9'>All caught up</td></tr> : invoices}
            </tbody>
           </Table>
         </div>
       </div>
     </div>
    )
  }
}

export default App;