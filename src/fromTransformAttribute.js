import {parse} from './fromTransformAttribute.autogenerated'
import {translate} from './translate'
import {transform} from "./transform";
import {rotate} from "./rotate";
import {fromObject} from "./fromObject";


/**
 * Parse SVG Trasform Attribute http://www.w3.org/TR/SVG/coords.html#TransformAttribute
 * @param transformString string
 * @param generateMatrices boolean
 * @return Object
 */
export function fromTransformAttribute(transformString, generateMatrices = true) {
  let descriptors = parse(transformString)
  let matrices = generateMatrices ? descriptors.map(convertMatrixDescriptorToMatrix) : undefined
  return {descriptors, matrices}
}

function convertMatrixDescriptorToMatrix(matrixDescriptor) {

  let hasParam = key => matrixDescriptor.hasOwnProperty(key)

  let {t: type, ...params} = matrixDescriptor;
  switch (type) {
    case 'matrix':
      return fromObject(params)

    case 'translate':
      if (hasParam('ty'))
        return translate(params.tx, params.ty)

      return translate(params.tx, 0)

    case 'scale':
      //TODO
      return;

    case 'rotate':
      if (hasParam('cx') && hasParam('cy'))
        return transform(translate(-params.cx, -params.cy), rotate(params.angle), rotate(params.cx), rotate(params.cy))

      return rotate(params.angle)

    case 'skewX':
      //TODO
      return;

    case 'skewY':
      //TODO
      return;

    default:
      throw new Error('Unsupported descriptor')
  }
}
