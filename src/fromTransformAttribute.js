import {parse} from './fromTransformAttribute.autogenerated'
import {translate} from './translate'
import {rotateDEG} from './rotate'
import {fromObject} from './fromObject'
import {scale} from './scale'
import {skewDEG} from './skew'

/**
 * Parser for SVG Trasform Attribute http://www.w3.org/TR/SVG/coords.html#TransformAttribute <br/>
 * Warning: This should be considered BETA until it is released a stable version of pegjs.
 * @param transformString string
 * @returns {{descriptors: *, matrices: *}} Parsed matrices
 */
export function fromTransformAttribute (transformString) {
  let descriptors = parse(transformString)
  let matrices = descriptors.map(convertMatrixDescriptorToMatrix)
  return {descriptors, matrices}
}

function convertMatrixDescriptorToMatrix (matrixDescriptor) {
  let hasParam = key => matrixDescriptor.hasOwnProperty(key)

  let {type, ...params} = matrixDescriptor
  switch (type) {
    case 'matrix':
      return fromObject(params)

    case 'translate':
      if (hasParam('ty')) { return translate(params.tx, params.ty) }

      return translate(params.tx)

    case 'scale':
      if (hasParam('sy')) { return scale(params.sx, params.sy) }

      return scale(params.sx)

    case 'rotate':
      if (hasParam('cx') && hasParam('cy')) { return rotateDEG(params.angle, params.cx, params.cy) }

      return rotateDEG(params.angle)

    case 'skewX':
      return skewDEG(params.angle, 0)

    case 'skewY':
      return skewDEG(0, params.angle)

    default:
      /* istanbul ignore next */
      throw new Error('Unsupported descriptor')
  }
}
