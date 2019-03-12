import React from "react";
import "./search.css";

function ProductRow(props) {
  return (
    <div className="flex product-row">
      <div className="row-title">{props.name}</div>
      <div className="row-data">{props.price}</div>
    </div>
  );
}

function ProductCategoryRow(props) {
  return <div className="category">{props.category}</div>;
}

function ProductTable(props) {
  let htmlCode = [],
    products = props.products;
  for (let key in products) {
    htmlCode.push(
      <div key={key}>
        <ProductCategoryRow category={key} />
        <div>
          {products[key].map(goods => {
            return (
              <ProductRow
                key={goods.name}
                name={goods.name}
                price={goods.price}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="product-table">
      <div className="header flex">
        <div className="row-title">Name</div>
        <div className="row-data">Price</div>
      </div>
      {htmlCode}
    </div>
  );
}

class SearchBar extends React.Component {
  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="search"
          value={this.props.filter}
          className="search-input"
          onChange={this.props.onInput}
        />
        <label className="serach-flag" onChange={this.props.onChange}>
          <input type="checkbox" value={this.props.stocked} />
          Only show products in stock
        </label>
      </div>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "",
      stocked: false
    };

    this.inputHandle = throttle(this.inputHandle, 20);
    this.changeHandle = this.changeHandle.bind(this);
    this.inputHandle = this.inputHandle.bind(this);
  }

  inputHandle(e) {
    this.setState({
      filter: e.target.value
    });
  }

  changeHandle(e) {
    this.setState({
      stocked: e.target.checked
    });
  }

  handleData() {
    let filter = this.state.filter,
      stocked = this.state.stocked;

    let outData = {};
    this.props.products.forEach(product => {
      let category = product.category;

      if (stocked === false || product.stocked) {
        if (filter === "" || product.name.indexOf(filter) > -1) {
          if (!outData[category]) {
            outData[category] = [];
          }
          outData[category].push(product);
        }
      }
    });

    return outData;
  }

  render() {
    let products = this.handleData();

    return (
      <div>
        <SearchBar
          stocked={this.state.stocked}
          filter={this.state.filter}
          onChange={this.changeHandle}
          onInput={this.inputHandle}
        />
        <ProductTable products={products} />
      </div>
    );
  }
}

function throttle(fn, delay) {
  let lastTime = 0;
  return function() {
    let nowTime = Date.now();
    if (nowTime - lastTime > delay) {
      fn.apply(this, arguments);
      lastTime = nowTime;
    }
  };
}

export default FilterableProductTable;