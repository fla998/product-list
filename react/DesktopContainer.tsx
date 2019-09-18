import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { IconDelete } from 'vtex.styleguide'

import { AVAILABLE } from './constants/Availability'
import { useItemContext } from './components/ItemContext'
import Selector from './components/QuantitySelector'
import { opaque } from './utils/opaque'

import styles from './styles.css'

const MAX_ITEM_QUANTITY = 99999

const DesktopContainer: FunctionComponent = () => {
  const { item, onQuantityChange, onRemove } = useItemContext()

  return (
    <div className="flex-auto">
      <div className={`flex-auto flex-m ${opaque(item.availability)}`}>
        {/* Product Info */}
        <div className="flex-auto w-100 flex mb4 mr7-m">
          {/* Brand and Name */}
          <div className="flex-auto">
            <div className="ttu f7 fw6 c-muted-1 mb2 fw5-m">
              {item.additionalInfo.brandName}
            </div>
            <div>
              <a
                className="c-on-base t-title lh-copy fw6 no-underline fw5-m"
                href={item.detailUrl}
              >
                {item.name}
              </a>
            </div>
            {/* Variations */}
            {item.skuSpecifications && item.skuSpecifications.length > 0 && (
              <div className="mt2 c-muted-1 f6 lh-copy">
                {item.skuSpecifications.map(
                  (spec: SKUSpecification, idx: number) => {
                    return (
                      <div key={idx}>
                        {`${spec.fieldName}: ${spec.fieldValues.join(', ')}`}
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>

          {/* Remove - Mobile */}
          <div className="flex-none dn-m">
            <button
              className="bg-transparent bn pa2 mt4-m ml4"
              title="remove"
              onClick={() => onRemove()}
            >
              <IconDelete color="#727273" />
            </button>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className={`${styles.quantity} flex-none-m`}>
          <div className={`${styles.quantitySelector}`}>
            <Selector
              value={item.quantity}
              maxValue={MAX_ITEM_QUANTITY}
              onChange={onQuantityChange}
              disabled={item.availability !== AVAILABLE}
            />
          </div>

          {item.quantity > 1 && (
            <div className="mt3 t-mini c-muted-1 tc-m lh-title">
              <FormattedMessage
                id="store/product-list.pricePerUnit"
                values={{
                  price: (
                    <div className="dib">
                      <FormattedCurrency value={item.sellingPrice / 100} />
                    </div>
                  ),
                  perMeasurementUnit: (
                    <div className="dib">
                      <FormattedMessage
                        id="store/product-list.pricePerUnit.measurementUnit"
                        values={{ measurementUnit: item.measurementUnit }}
                      />
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </div>

        {/* Price */}
        <div
          className={`${styles.price} mt5 mt0-ns flex-m items-center-m tr-m flex-none-m ml5-m`}
        >
          <div className="flex-auto">
            {item.listPrice !== item.price && (
              <div className="c-muted-1 strike t-mini mb2">
                <FormattedCurrency
                  value={(item.listPrice * item.quantity) / 100}
                />
              </div>
            )}
            <div className="div fw6 fw5-m">
              <FormattedCurrency
                value={(item.sellingPrice * item.quantity) / 100}
              />
            </div>
          </div>
        </div>

        {/* Remove - Desktop */}
        <div
          className={`${styles.remove} flex-m items-center-m flex-none-m dn db-m`}
        >
          <div className="flex-auto">
            <button
              className="pointer bg-transparent bn pa2 ml6"
              onClick={onRemove}
            >
              <IconDelete color="#727273" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopContainer