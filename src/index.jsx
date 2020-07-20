import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
  
class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      data: null,
      rowsPerPage: 10,
      dataLoaded: false,
      date1: null,
      date2: null,
      columns: [
        {title: "Name", field: "contactName"},
        {title: "Id", field: "contactId"},
              ]
    }
  }

  update(value) {
    console.log(value);
    if (value.length >= 3) {
      Axios.get(`https://localhost:44305/api/messages/contacts/${value}`)
      .then(res => {
        this.setState({
          data: res.data,
          dataLoaded: true,
        }
        )
      })
    }
  }

  updateOnKeyDown(event) {
    if (event.keyCode === 13) {
      Axios.get(`https://localhost:44305/api/messages/contacts/${event.target.value}`)
      .then(res => {
        this.setState({
          data: res.data,
          dataLoaded: true
        })
      })
    }
  }


  componentDidMount() {
    Axios.get('https://localhost:44305/api/messages/date/2020-05-22/2020-05-23')
      .then(res => {
        console.log(res);
        let newDate = new Date(res.data.date);
        let finalDate = `${newDate.getMonth}/${newDate.getDay}/${newDate.getFullYear}`;
        res.data.date = finalDate;
        this.setState({
          data: res.data,
          dataLoaded: true
        }
        )
        console.log(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)

      })
  }

  handleChangePage (event, newPage) {
    console.log(newPage);
     this.setState({
      page: newPage
     })
  };

  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    })
  };

  setDate1(value) {
    this.setState({
      date1: value
    })
  }

  setDate2(value) {
    this.setState({
      date2: value
    })
  }

  handleDateSearch() {
    Axios.get(`https://localhost:44305/api/messages/date/${this.state.date1}/${this.state.date2}`)
    .then(res => {
      this.setState({
        data: res.data,
        dataLoaded: true
      })
    })
  }

  render() {

      return (
        <div style={{width: '75%', margin: '0 auto'}}>
        <div style={{textAlign: 'left', margin: '0 auto'}}> 

        <form action="">
        <Grid container>
          <Grid item xs={3}>
            <TextField id="standard-secondary" onBlur={event => this.update(event.target.value)} onKeyDown={event => this.updateOnKeyDown(event)} label="Search Messages" color="secondary" />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="date"
              label="Start Date"
              type="date"
              onChange={(event) => this.setDate1(event.target.value)}
              defaultValue="2017-05-24"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="date"
              label="End Date"
              type="date"
              onChange={(event) => this.setDate2(event.target.value)}
              defaultValue="2017-05-24"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={2} style={{paddingTop: '20px'}}>
            <Chip color="primary" label={`Search Results: ${this.state.data ? this.state.data.length : ''}`} />
          </Grid>
          <Grid item xs={2} style={{paddingTop: '20px'}}>
          <Button variant="contained" color="primary" onClick={event => this.handleDateSearch()}>
            Search Dates
          </Button>
          </Grid>
        </Grid>
        </form>
        </div>
        <br/>
        <br/>
        <div style={{textAlign: 'center', margin: '0 auto'}}> 

        <TableContainer component={Paper}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{width:'15%'}} align="left"><b>Date</b></TableCell>
              <TableCell style={{width:'15%'}} align="left"><b>Sender</b></TableCell>
              <TableCell style={{width:'25%'}} align="left"><b>Recipients</b></TableCell>
              <TableCell style={{width:'45%'}} align="left"><b>Message</b></TableCell>
            </TableRow>
          </TableHead>
          { this.state.dataLoaded && <TableBody>
            {this.state.data
            .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
            .map((row) => (
              <TableRow key={row.contactId}>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.recipients}</TableCell>
                <TableCell align="left">{row.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          }
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          component="div"
          count={this.state.data ? this.state.data.length : 0}
          rowsPerPage={this.state.rowsPerPage ? this.state.rowsPerPage : 10}
          page={this.state.page ? this.state.page : 0}
          onChangePage={this.handleChangePage.bind(this)}
          onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
        />
    </div>
    <div>
    {/* <Grid container>
      { this.state.data 
          && <div>
          {this.state.data
            .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
            .map((row) => {
             if (row.name === 'Dan Gunko') {
                return (
                  <Grid item xs={12}>
                    <Grid item xs={6}>
                <div style={{textAlign: 'left', backgroundColor: 'blue', color: 'white', display: 'inline-block', padding: '3px', borderRadius: '60px'}}>
                <div key={row.contactId}>
                <span align="left">{row.date}</span>
                <span align="left">{row.name}</span>
                <span align="left">{row.message}</span>
              </div>

              </div>
              </Grid>
              </Grid>
              
              )
             }

            
             if (row.name === 'Megan Cassidy') {
              return               ( <div style={{textAlign: 'right', backgroundColor: 'lightgray', color: 'black'}}>
              <div key={row.contactId}>
              <span align="left">{row.date}</span>
              <span align="left">{row.name}</span>
              <span align="left">{row.message}</span>
            </div>
          </div>)
             }
            
            })}
            <br/>
          </div>

      }
      </Grid> */}

    </div>
    </div>
      );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Board />,
    document.getElementById('root')
  );
  