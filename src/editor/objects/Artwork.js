import { Object3D, MeshBasicMaterial, FrontSide, Mesh, sRGBEncoding, LinearFilter, PlaneBufferGeometry } from "three";
import loadTexture from "../utils/loadTexture";

export const ImageProjection = {
  Flat: "flat",
  Equirectangular360: "360-equirectangular"
};

export const ImageAlphaMode = {
  Opaque: "opaque",
  Blend: "blend",
  Mask: "mask"
};

export default class Artwork extends Object3D {
  constructor() {
    super();
    this._src = null;
    this._width = 0;
    this._height = 0;
    this._title = "";
    this._artist = "";
    this._medium = "";
    this._style = "";

    const geometry = new PlaneBufferGeometry();
    const material = new MeshBasicMaterial();
    material.side = FrontSide;
    material.transparent = false;
    this._mesh = new Mesh(geometry, material);
    this._mesh.name = "ArtworkMesh";
    this.add(this._mesh);
    this._texture = null;
  }

  get src() {
    return this._src;
  }

  set src(src) {
    this.load(src).catch(console.error);
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
  }

  get artist() {
    return this._artist;
  }

  set artist(artist) {
    this._artist = artist;
  }

  get medium() {
    return this._medium;
  }

  set medium(medium) {
    this._medium = medium;
  }

  get style() {
    return this._style;
  }

  set style(style) {
    this._style = style;
  }

  loadTexture(src) {
    return loadTexture(src);
  }

  get projection() {
    return this._projection;
  }

  set projection(projection) {
    const material = new MeshBasicMaterial();
    const geometry = new PlaneBufferGeometry();
    material.side = FrontSide;
    material.map = this._texture;
    material.transparent = false;

    this._projection = projection;

    const nextMesh = new Mesh(geometry, material);
    nextMesh.name = "ArtworkMesh";
    nextMesh.visible = this._mesh.visible;

    const meshIndex = this.children.indexOf(this._mesh);

    if (meshIndex === -1) {
      this.add(nextMesh);
    } else {
      this.children.splice(meshIndex, 1, nextMesh);
      nextMesh.parent = this;
    }

    this._mesh = nextMesh;

    this.onResize();
  }

  async load(src) {
    this._src = src;
    this._mesh.visible = false;

    const material = this._mesh.material;

    if (material.map) {
      material.map.dispose();
    }

    const texture = await this.loadTexture(src);
    // TODO: resize to maintain aspect ratio but still allow scaling.
    texture.encoding = sRGBEncoding;
    texture.minFilter = LinearFilter;

    this._texture = texture;

    this.onResize();

    material.transparent = false;

    this._mesh.material.map = this._texture;
    this._mesh.material.needsUpdate = true;
    this._mesh.visible = true;

    return this;
  }

  onResize() {
    if (this._texture) {
      const ratio = (this._texture.image.width || 1.0) / (this._texture.image.height || 1.0);
      const width = Math.min(this._width) * 2;
      const height = Math.min(this._width / ratio) * 2;
      this._mesh.scale.set(width, height, 1.5);
    }
  }

  copy(source, recursive = true) {
    if (recursive) {
      this.remove(this._mesh);
    }

    super.copy(source, recursive);

    if (recursive) {
      const _meshIndex = source.children.indexOf(source._mesh);

      if (_meshIndex !== -1) {
        this._mesh = this.children[_meshIndex];
      }
    }

    this.projection = source.projection;
    this.src = source.src;
    this.width = source.width;

    return this;
  }
}
