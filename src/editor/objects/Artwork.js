import {
  Object3D,
  FrontSide,
  Mesh,
  sRGBEncoding,
  LinearFilter,
  PlaneBufferGeometry,
  MeshStandardMaterial,
  BoxBufferGeometry
} from "three";
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
    this._description = "";
    this._year = "";
    this._url = "";

    const geometry = new PlaneBufferGeometry();
    const material = new MeshStandardMaterial();
    material.side = FrontSide;
    material.transparent = false;
    this._mesh = new Mesh(geometry, material);
    this._mesh.name = "ArtworkMesh";
    this.add(this._mesh);
    this._texture = null;

    const geometry2 = new BoxBufferGeometry();
    const material2 = new MeshStandardMaterial();
    this._frametop = new Mesh(geometry2, material2);
    this._frametop.name = "ArtworkFrameTop";
    this._frameleft = new Mesh(geometry2, material2);
    this._frameleft.name = "ArtworkFrameLeft";
    this._frameright = new Mesh(geometry2, material2);
    this._frameright.name = "ArtworkFrameRight";
    this._framebottom = new Mesh(geometry2, material2);
    this._framebottom.name = "ArtworkFrameBottom";
    this.add(this._frametop);
    this.add(this._frameright);
    this.add(this._frameleft);
    this.add(this._framebottom);
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

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get year() {
    return this._year;
  }

  set year(year) {
    this._year = year;
  }

  get style() {
    return this._style;
  }

  set style(style) {
    this._style = style;
  }

  get url() {
    return this._url;
  }

  set url(url) {
    this._url = url;
  }

  loadTexture(src) {
    return loadTexture(src);
  }

  get projection() {
    return this._projection;
  }

  set projection(projection) {
    const material = new MeshStandardMaterial();
    const geometry = new PlaneBufferGeometry();
    material.side = FrontSide;
    material.map = this._texture;
    material.transparent = false;

    this._projection = projection;

    const nextMesh = new Mesh(geometry, material);
    nextMesh.name = "ArtworkMesh";
    nextMesh.visible = this._mesh.visible;

    const geometry2 = new BoxBufferGeometry();
    const material2 = new MeshStandardMaterial({ color: "#000" });

    const _frametop = new Mesh(geometry2, material2);
    _frametop.name = "ArtworkFrameTop";
    const _frameleft = new Mesh(geometry2, material2);
    _frameleft.name = "ArtworkFrameLeft";
    const _frameright = new Mesh(geometry2, material2);
    _frameright.name = "ArtworkFrameRight";
    const _framebottom = new Mesh(geometry2, material2);
    _framebottom.name = "ArtworkFrameBottom";

    const meshIndex = this.children.indexOf(this._mesh);

    if (meshIndex === -1) {
      this.add(nextMesh);
      this.add(_frametop);
      this.add(_frameleft);
      this.add(_frameright);
      this.add(_framebottom);
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
    this._mesh.material.light = true;
    this._mesh.visible = true;
    this._framebottom.receiveShadow = true;
    this._frametop.receiveShadow = true;
    this._frameleft.receiveShadow = true;
    this._frameright.receiveShadow = true;

    this._framebottom.castShadow = true;
    this._frametop.castShadow = true;
    this._frameleft.castShadow = true;
    this._frameright.castShadow = true;

    return this;
  }

  onResize() {
    if (this._texture) {
      const ratio = (this._texture.image.width || 1.0) / (this._texture.image.height || 1.0);
      const width = Math.min(this._width) * 2;
      const height = Math.min(this._width / ratio) * 2;
      this._mesh.scale.set(width, height, 1.5);
      // this._frame.scale.set(width + 0.3, height + 0.3, 0.03);
      this._frametop.scale.set(width + 0.3, 0.15, 0.05);
      this._framebottom.scale.set(width + 0.3, 0.15, 0.05);
      this._frameleft.scale.set(0.15, height + 0.3, 0.05);
      this._frameright.scale.set(0.15, height + 0.3, 0.05);

      // console.log(width / 2 - 0.15);
      this._frametop.position.setY(height / -2 - 0.075);
      this._framebottom.position.setY(height / 2 + 0.075);
      this._frameleft.position.setX(width / -2 - 0.075);
      this._frameright.position.setX(width / 2 + 0.075);

      // this._mesh.translateZ(0.031);
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

    this.src = source.src;
    this.width = source.width;
    this.height = source.height;
    this.title = source.title;
    this.artist = source.artist;
    this.medium = source.medium;
    this.style = source.style;
    this.url = source.url;
    this.year = source.year;
    this.description = source.description;

    return this;
  }
}
