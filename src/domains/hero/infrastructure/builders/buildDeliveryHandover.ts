import * as THREE from "three";
import { DELIVERY_SCENE } from "../../domain/constants";

export interface ArticulatedCharacter {
  root: THREE.Group;
  upperBody: THREE.Group;
  headGroup: THREE.Group;
  armL: THREE.Group;
  foreArmL: THREE.Group;
  handL: THREE.Group;
  armR: THREE.Group;
  foreArmR: THREE.Group;
  handR: THREE.Group;
}

export interface DeliveryHandoverComponents {
  deliverySceneGroup: THREE.Group;
  courier: ArticulatedCharacter;
  client: ArticulatedCharacter;
  parcelGroup: THREE.Group;
  boxTexture: THREE.CanvasTexture;
}

/**
 * Final act: a courier handing a sealed parcel to a client on an architectural platform.
 * The group starts collapsed (scale ≈ 0) and is revealed by the scroll timeline.
 */
export function buildDeliveryHandover(): DeliveryHandoverComponents {
  const deliverySceneGroup = new THREE.Group();
  deliverySceneGroup.position.set(
    DELIVERY_SCENE.position.x,
    DELIVERY_SCENE.position.y,
    DELIVERY_SCENE.position.z
  );
  deliverySceneGroup.scale.setScalar(DELIVERY_SCENE.hiddenScale);

  // پالت متریال‌های کالیبره‌شده برای ایجاد سایه‌روشن، خطوط یقه، چروک لباس و انگشتان در شیدر مدادی
  const inkBlackMat = new THREE.MeshStandardMaterial({ color: 0x141417, roughness: 0.65 });
  const suitDarkMat = new THREE.MeshStandardMaterial({ color: 0x1f2748, roughness: 0.55 });
  const charcoalMat = new THREE.MeshStandardMaterial({ color: 0x4a4034, roughness: 0.55 });
  const jacketMidMat = new THREE.MeshStandardMaterial({ color: 0x4b5670, roughness: 0.5 });
  const vestSlateMat = new THREE.MeshStandardMaterial({ color: 0x857057, roughness: 0.48 });
  const trouserMidMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.52 });
  const skinSketchMat = new THREE.MeshStandardMaterial({ color: 0xf0d5bf, roughness: 0.58 });
  const shirtLightMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.45 });

  // ۱. سکوی معماری با خطوط تراز مهندسی
  const floorBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3.65, 3.8, 0.08, 64),
    shirtLightMat
  );
  floorBase.position.y = -0.04;
  deliverySceneGroup.add(floorBase);

  const floorOuterRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.65, 0.024, 10, 96),
    inkBlackMat
  );
  floorOuterRing.rotation.x = Math.PI / 2;
  deliverySceneGroup.add(floorOuterRing);

  const floorInnerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.65, 0.014, 8, 72),
    jacketMidMat
  );
  floorInnerRing.rotation.x = Math.PI / 2;
  floorInnerRing.position.y = 0.005;
  deliverySceneGroup.add(floorInnerRing);

  // تابع ساخت دست کامل با کف دست، شست و ۴ انگشت مفصل‌دار
  function createArticulatedHand(dirX: number, side: number) {
    const handGroup = new THREE.Group();

    // مچ دست
    const wrist = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.075, 0.1, 12),
      skinSketchMat
    );
    wrist.rotation.z = -dirX * (Math.PI / 2);
    handGroup.add(wrist);

    // کف دست (کمی زاویه‌دار به سمت داخل برای گرفتن جعبه)
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.065), skinSketchMat);
    palm.position.set(dirX * 0.1, 0.01, -side * 0.015);
    palm.rotation.y = side * dirX * 0.28;
    palm.rotation.x = side * 0.15;
    handGroup.add(palm);

    // انگشت شست (رو به بالا برای مهار دیواره جعبه)
    const thumbBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.028, 0.1, 8),
      skinSketchMat
    );
    thumbBase.position.set(dirX * 0.12, 0.085, -side * 0.035);
    thumbBase.rotation.z = -dirX * 0.75;
    thumbBase.rotation.x = -side * 0.25;
    handGroup.add(thumbBase);

    const thumbTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.023, 0.07, 8),
      skinSketchMat
    );
    thumbTip.position.set(dirX * 0.165, 0.125, -side * 0.045);
    thumbTip.rotation.z = -dirX * 1.1;
    handGroup.add(thumbTip);

    // ۴ انگشت دست که زیر و کنار جعبه خم شده‌اند
    for (let f = 0; f < 4; f++) {
      const yOff = 0.042 - f * 0.032;
      const lenFactor = f === 1 ? 1.08 : f === 3 ? 0.85 : 0.98;

      // بند اول انگشت
      const knuckle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.019, 0.022, 0.085 * lenFactor, 8),
        skinSketchMat
      );
      knuckle.position.set(dirX * 0.21, yOff, -side * 0.032);
      knuckle.rotation.z = -dirX * (Math.PI / 2);
      knuckle.rotation.y = side * dirX * 0.48;
      handGroup.add(knuckle);

      // بند دوم (خمیده به سمت جعبه)
      const fingerTip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.019, 0.07 * lenFactor, 8),
        skinSketchMat
      );
      fingerTip.position.set(dirX * 0.265, yOff + 0.012, -side * 0.068);
      fingerTip.rotation.z = -dirX * 1.25;
      fingerTip.rotation.y = side * dirX * 0.95;
      handGroup.add(fingerTip);
    }

    return handGroup;
  }

  // تابع ساخت کاراکتر انسان با تناسبات آناتومیک ۸ سر و جزئیات لباس
  function createHumanCharacter(isCourier: boolean): ArticulatedCharacter {
    const root = new THREE.Group();
    const dirX = isCourier ? 1 : -1;

    const mainCoatMat = isCourier ? charcoalMat : suitDarkMat;
    const secondaryMat = isCourier ? vestSlateMat : jacketMidMat;
    const pantsMat = isCourier ? suitDarkMat : trouserMidMat;

    /* ----------------------------------------------------------
       ۱. پایین‌تنه: لگن، کمربند، ران، زانو، ساق پا و کفش‌های واقعی
       ---------------------------------------------------------- */
    const pelvis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.25, 0.3, 20),
      pantsMat
    );
    pelvis.scale.set(0.82, 1.0, 1.18);
    pelvis.position.y = 1.62;
    root.add(pelvis);

    // کمربند و سگک برای ایجاد خط تفکیک واضح کمر در شیدر
    const belt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.286, 0.286, 0.075, 20),
      inkBlackMat
    );
    belt.scale.set(0.83, 1.0, 1.19);
    belt.position.y = 1.75;
    root.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.12), shirtLightMat);
    buckle.position.set(dirX * 0.23, 1.75, 0);
    root.add(buckle);

    // پاها با حالت ایستادن طبیعی (یک پا کمی جلوتر برای انتقال وزن واقعی)
    for (const side of [-1, 1]) {
      const isLeadLeg = (isCourier && side === 1) || (!isCourier && side === -1);
      const strideX = isLeadLeg ? dirX * 0.14 : -dirX * 0.09;
      const thighAngle = isLeadLeg ? -dirX * 0.11 : dirX * 0.07;
      const calfAngle = isLeadLeg ? dirX * 0.04 : dirX * 0.12;
      const hipZ = side * 0.175;

      // مفصل ران
      const hipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.145, 14, 14), pantsMat);
      hipJoint.position.set(0, 1.54, hipZ);
      root.add(hipJoint);

      // ران پا
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.155, 0.122, 0.74, 16),
        pantsMat
      );
      thigh.scale.set(1.05, 1.0, 0.94);
      thigh.position.set(strideX * 0.45, 1.19, hipZ);
      thigh.rotation.z = thighAngle;
      root.add(thigh);

      // مفصل زانو
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.118, 14, 12), pantsMat);
      knee.position.set(strideX * 0.85, 0.82, hipZ);
      root.add(knee);

      // ساق پا
      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.118, 0.092, 0.7, 16),
        pantsMat
      );
      calf.position.set(strideX * 0.92, 0.47, hipZ);
      calf.rotation.z = calfAngle;
      root.add(calf);

      // پاچه شلوار (ایجاد خط لبه روی مچ پا)
      const trouserCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.102, 0.105, 0.06, 16),
        pantsMat
      );
      trouserCuff.position.set(strideX * 0.95, 0.16, hipZ);
      root.add(trouserCuff);

      // کفش آناتومیک (پاشنه، بدنه، پنجه گرد و زیره)
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(strideX * 0.96, 0, hipZ);
      shoeGroup.rotation.y = -side * dirX * 0.08;

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.035, 0.175), inkBlackMat);
      sole.position.set(dirX * 0.07, 0.018, 0);
      shoeGroup.add(sole);

      const heel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.165), suitDarkMat);
      heel.position.set(-dirX * 0.06, 0.075, 0);
      shoeGroup.add(heel);

      const vamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.095, 0.24, 14),
        isCourier ? charcoalMat : inkBlackMat
      );
      vamp.rotation.z = -dirX * 1.35;
      vamp.position.set(dirX * 0.06, 0.085, 0);
      shoeGroup.add(vamp);

      const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.082, 14, 12), inkBlackMat);
      toeCap.scale.set(1.35, 0.68, 1.0);
      toeCap.position.set(dirX * 0.19, 0.058, 0);
      shoeGroup.add(toeCap);

      root.add(shoeGroup);
    }

    /* ----------------------------------------------------------
       ۲. بالاتنه مفصل‌دار (قفسه سینه، یقه، جلیقه/کت، کراوات/کارت)
       ---------------------------------------------------------- */
    const upperBody = new THREE.Group();
    upperBody.position.set(0, 1.75, 0);
    root.add(upperBody);

    // شکم و کمر
    const abdomen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.27, 0.44, 20),
      mainCoatMat
    );
    abdomen.scale.set(0.78, 1.0, 1.15);
    abdomen.position.y = 0.22;
    upperBody.add(abdomen);

    // قفسه سینه و سرشانه پهن‌تر
    const chest = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.31, 0.62, 24),
      mainCoatMat
    );
    chest.scale.set(0.78, 1.0, 1.22);
    chest.position.y = 0.68;
    upperBody.add(chest);

    // پیراهن روشن زیر کت/جلیقه
    const innerShirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.22, 0.56, 16),
      shirtLightMat
    );
    innerShirt.scale.set(0.84, 1.0, 0.85);
    innerShirt.position.set(dirX * 0.08, 0.72, 0);
    upperBody.add(innerShirt);

    // حلقه یقه پیراهن
    const collarBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.145, 0.165, 0.12, 16),
      shirtLightMat
    );
    collarBand.position.set(dirX * 0.02, 1.03, 0);
    upperBody.add(collarBand);

    if (isCourier) {
      // جلیقه لجستیک دو لایه روی لباس مامور تحویل
      const vestPanel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.392, 0.325, 0.78, 20),
        secondaryMat
      );
      vestPanel.scale.set(0.8, 1.0, 1.18);
      vestPanel.position.y = 0.56;
      upperBody.add(vestPanel);

      // نوارهای عمودی و افقی جلیقه کار (ایجاد خطوط گرافیکی عالی در شیدر)
      const vestStripeH = new THREE.Mesh(
        new THREE.CylinderGeometry(0.398, 0.385, 0.07, 20),
        shirtLightMat
      );
      vestStripeH.scale.set(0.81, 1.0, 1.19);
      vestStripeH.position.y = 0.38;
      upperBody.add(vestStripeH);

      // جیب سینه و کارت شناسایی مامور
      const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.1), shirtLightMat);
      idBadge.position.set(dirX * 0.3, 0.74, 0.16);
      idBadge.rotation.y = 0.25;
      upperBody.add(idBadge);

      const badgeClip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.06), inkBlackMat);
      badgeClip.position.set(dirX * 0.305, 0.81, 0.16);
      badgeClip.rotation.y = 0.25;
      upperBody.add(badgeClip);
    } else {
      // یقه‌های انگلیسی کت رسمی (Lapels) و کراوات برای مشتری/مدیر
      for (const side of [-1, 1]) {
        const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.11), charcoalMat);
        lapel.position.set(dirX * 0.27, 0.74, side * 0.11);
        lapel.rotation.x = side * 0.26;
        lapel.rotation.z = dirX * 0.12;
        upperBody.add(lapel);
      }

      // گره و بدنه کراوات
      const tieKnot = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), inkBlackMat);
      tieKnot.position.set(dirX * 0.26, 0.94, 0);
      upperBody.add(tieKnot);

      const tieBlade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.42, 0.065), inkBlackMat);
      tieBlade.position.set(dirX * 0.285, 0.71, 0);
      tieBlade.rotation.z = dirX * 0.08;
      upperBody.add(tieBlade);

      // دستمال جیب کت
      const pocketSquare = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.11), shirtLightMat);
      pocketSquare.position.set(dirX * 0.28, 0.76, -0.19);
      pocketSquare.rotation.y = -0.25;
      upperBody.add(pocketSquare);
    }

    /* ----------------------------------------------------------
       ۳. گردن، سر، فک، بینی، گوش، مو/کلاه و عینک
       ---------------------------------------------------------- */
    const headGroup = new THREE.Group();
    headGroup.position.set(dirX * 0.03, 1.06, 0);
    upperBody.add(headGroup);

    // گردن آناتومیک با زاویه طبیعی رو به جلو
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.135, 0.22, 16),
      skinSketchMat
    );
    neck.position.set(0, 0.08, 0);
    neck.rotation.z = -dirX * 0.08;
    headGroup.add(neck);

    // جمجمه
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 20), skinSketchMat);
    cranium.scale.set(1.02, 1.08, 0.92);
    cranium.position.set(dirX * 0.02, 0.38, 0);
    headGroup.add(cranium);

    // فک و چانه زاویه‌دار برای ایجاد سایه طبیعی زیر صورت
    const jaw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.135, 0.22, 16),
      skinSketchMat
    );
    jaw.scale.set(1.08, 1.0, 0.88);
    jaw.position.set(dirX * 0.055, 0.26, 0);
    jaw.rotation.z = -dirX * 0.12;
    headGroup.add(jaw);

    // تیغه بینی
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.13, 8), skinSketchMat);
    nose.position.set(dirX * 0.275, 0.35, 0);
    nose.rotation.z = -dirX * 1.25;
    headGroup.add(nose);

    // برجستگی ابروها (ایجاد خط چشم در شیدر مدادی)
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.022, 0.065), charcoalMat);
      brow.position.set(dirX * 0.245, 0.425, side * 0.075);
      brow.rotation.y = side * dirX * 0.22;
      headGroup.add(brow);

      // گوش‌ها
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 10), skinSketchMat);
      ear.scale.set(0.55, 1.15, 0.42);
      ear.position.set(-dirX * 0.02, 0.35, side * 0.235);
      headGroup.add(ear);
    }

    if (isCourier) {
      // کلاه کپ لجستیک با کاسه، نوار دور سر و نقاب خمیده
      const capCrown = new THREE.Mesh(
        new THREE.SphereGeometry(0.272, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.56),
        inkBlackMat
      );
      capCrown.scale.set(1.06, 0.96, 0.95);
      capCrown.position.set(dirX * 0.015, 0.41, 0);
      capCrown.rotation.z = -dirX * 0.06;
      headGroup.add(capCrown);

      const capBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.274, 0.274, 0.055, 24),
        suitDarkMat
      );
      capBand.scale.set(1.06, 1.0, 0.95);
      capBand.position.set(dirX * 0.015, 0.43, 0);
      capBand.rotation.z = -dirX * 0.06;
      headGroup.add(capBand);

      const capVisor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.27, 0.032, 20, 1, false, -Math.PI * 0.38, Math.PI * 0.76),
        inkBlackMat
      );
      capVisor.scale.set(1.35, 1.0, 0.92);
      capVisor.position.set(dirX * 0.14, 0.415, 0);
      capVisor.rotation.y = Math.PI / 2;
      capVisor.rotation.z = -dirX * 0.18;
      headGroup.add(capVisor);
    } else {
      // مدل موی کلاسیک و پرحجم برای مشتری + عینک فریم‌دار
      const hairTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.275, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
        inkBlackMat
      );
      hairTop.scale.set(1.08, 1.02, 0.96);
      hairTop.position.set(-dirX * 0.01, 0.41, 0);
      hairTop.rotation.z = dirX * 0.16;
      headGroup.add(hairTop);

      const hairFrontSweep = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), inkBlackMat);
      hairFrontSweep.scale.set(1.1, 0.65, 1.45);
      hairFrontSweep.position.set(dirX * 0.16, 0.53, 0.02);
      hairFrontSweep.rotation.z = -dirX * 0.25;
      headGroup.add(hairFrontSweep);

      const hairBack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.18, 0.24, 16),
        inkBlackMat
      );
      hairBack.scale.set(0.85, 1.0, 0.94);
      hairBack.position.set(-dirX * 0.09, 0.34, 0);
      headGroup.add(hairBack);

      // عینک طبی برای جزئیات واقع‌گرایانه صورت
      for (const side of [-1, 1]) {
        const glassFrame = new THREE.Mesh(
          new THREE.TorusGeometry(0.048, 0.009, 8, 16),
          inkBlackMat
        );
        glassFrame.position.set(dirX * 0.255, 0.38, side * 0.075);
        glassFrame.rotation.y = Math.PI / 2;
        headGroup.add(glassFrame);
      }
    }

    /* ----------------------------------------------------------
       ۴. بازوها، آرنج، ساعد، سردست پیراهن و دست‌های مفصل‌دار
       ---------------------------------------------------------- */
    const arms: Partial<Pick<ArticulatedCharacter, "armL" | "foreArmL" | "handL" | "armR" | "foreArmR" | "handR">> = {};

    for (const side of [-1, 1]) {
      // مفصل سرشانه
      const shoulderGroup = new THREE.Group();
      shoulderGroup.position.set(0, 0.92, side * 0.42);
      upperBody.add(shoulderGroup);

      const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 14), mainCoatMat);
      deltoid.scale.set(1.05, 1.1, 0.95);
      shoulderGroup.add(deltoid);

      // بازو
      const upperArmMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.118, 0.098, 0.56, 16),
        mainCoatMat
      );
      upperArmMesh.position.set(0, -0.26, 0);
      shoulderGroup.add(upperArmMesh);

      // مفصل آرنج
      const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.096, 14, 12), mainCoatMat);
      elbowJoint.position.set(0, -0.54, 0);
      shoulderGroup.add(elbowJoint);

      // گروه ساعد (متصل به آرنج برای چرخش طبیعی)
      const foreArmGroup = new THREE.Group();
      foreArmGroup.position.set(0, -0.54, 0);
      shoulderGroup.add(foreArmGroup);

      const foreArmMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.096, 0.078, 0.52, 16),
        mainCoatMat
      );
      foreArmMesh.position.set(dirX * 0.24, 0, -side * 0.04);
      foreArmMesh.rotation.z = -dirX * (Math.PI / 2);
      foreArmMesh.rotation.y = side * dirX * 0.16;
      foreArmGroup.add(foreArmMesh);

      // سرآستین سفید پیراهن بیرون‌زده از آستین کت
      const shirtCuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.081, 0.081, 0.055, 16),
        shirtLightMat
      );
      shirtCuff.position.set(dirX * 0.5, 0, -side * 0.082);
      shirtCuff.rotation.z = -dirX * (Math.PI / 2);
      shirtCuff.rotation.y = side * dirX * 0.16;
      foreArmGroup.add(shirtCuff);

      // دست و انگشتان
      const handGroup = createArticulatedHand(dirX, side);
      handGroup.position.set(dirX * 0.54, 0, -side * 0.09);
      foreArmGroup.add(handGroup);

      if (side === -1) {
        arms.armL = shoulderGroup;
        arms.foreArmL = foreArmGroup;
        arms.handL = handGroup;
      } else {
        arms.armR = shoulderGroup;
        arms.foreArmR = foreArmGroup;
        arms.handR = handGroup;
      }
    }

    return {
      root,
      upperBody,
      headGroup,
      armL: arms.armL!,
      foreArmL: arms.foreArmL!,
      handL: arms.handL!,
      armR: arms.armR!,
      foreArmR: arms.foreArmR!,
      handR: arms.handR!,
    };
  }

  const courier = createHumanCharacter(true);
  courier.root.position.set(-1.18, 0, 0);
  deliverySceneGroup.add(courier.root);

  const client = createHumanCharacter(false);
  client.root.position.set(1.18, 0, 0);
  deliverySceneGroup.add(client.root);

  /* ----------------------------------------------------------
     ۵. جعبه صنعتی/تجاری با درز درپوش، نوار چسب، لیبل بارکد و تسمه
     ---------------------------------------------------------- */
  const boxC = document.createElement("canvas");
  boxC.width = 512;
  boxC.height = 512;
  const bCtx = boxC.getContext("2d")!;

  // بافت مقوایی روشن با کادرهای استاندارد حمل‌ونقل
  bCtx.fillStyle = "#e2cfae";
  bCtx.fillRect(0, 0, 512, 512);
  bCtx.strokeStyle = "#18181b";
  bCtx.lineWidth = 10;
  bCtx.strokeRect(10, 10, 492, 492);

  // برچسب بارنامه و بارکد
  bCtx.fillStyle = "#fafafa";
  bCtx.fillRect(48, 64, 220, 150);
  bCtx.strokeStyle = "#18181b";
  bCtx.lineWidth = 5;
  bCtx.strokeRect(48, 64, 220, 150);

  // خطوط بارکد روی لیبل
  bCtx.fillStyle = "#09090b";
  for (let bx = 66; bx < 248; bx += 11) {
    const bw = bx % 3 === 0 ? 6 : 3;
    bCtx.fillRect(bx, 84, bw, 68);
  }
  bCtx.fillRect(66, 168, 140, 12);
  bCtx.fillRect(66, 188, 95, 10);

  // آیکون‌های حمل‌ونقل (فلش رو به بالا در گوشه پایین)
  bCtx.strokeStyle = "#27272a";
  bCtx.lineWidth = 6;
  bCtx.strokeRect(360, 340, 104, 110);
  bCtx.beginPath();
  bCtx.moveTo(392, 425);
  bCtx.lineTo(392, 365);
  bCtx.moveTo(378, 382);
  bCtx.lineTo(392, 362);
  bCtx.lineTo(406, 382);
  bCtx.moveTo(432, 425);
  bCtx.lineTo(432, 365);
  bCtx.moveTo(418, 382);
  bCtx.lineTo(432, 362);
  bCtx.lineTo(446, 382);
  bCtx.stroke();

  const parcelGroup = new THREE.Group();
  const boxTexture = new THREE.CanvasTexture(boxC);

  const parcelBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 0.62, 0.72),
    new THREE.MeshStandardMaterial({ map: boxTexture, roughness: 0.52 })
  );
  parcelGroup.add(parcelBox);

  // نوار چسب وسط درپوش کارتن
  const topTape = new THREE.Mesh(new THREE.BoxGeometry(0.875, 0.08, 0.14), jacketMidMat);
  topTape.position.y = 0.28;
  parcelGroup.add(topTape);

  // دو تسمه پلاستیکی بسته‌بندی دور کارتن برای خطوط سه‌بعدی واقعی
  for (const strapX of [-0.24, 0.24]) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.635, 0.735), inkBlackMat);
    strap.position.x = strapX;
    parcelGroup.add(strap);
  }

  parcelGroup.position.set(-0.18, 2.15, 0);
  deliverySceneGroup.add(parcelGroup);

  return { deliverySceneGroup, courier, client, parcelGroup, boxTexture };
}
