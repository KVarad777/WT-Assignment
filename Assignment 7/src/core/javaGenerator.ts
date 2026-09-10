import { UMLClassData, UMLRelationshipData, UMLAttribute, UMLMethod } from './types';

export interface GeneratedJavaFile {
  fileName: string;
  className: string;
  packageName: string;
  code: string;
  isInterface: boolean;
  isEnum: boolean;
  isRecord: boolean;
  isAbstract: boolean;
}

export function generateJavaProject(
  classes: UMLClassData[],
  relationships: UMLRelationshipData[],
  defaultPackage: string = 'com.umlforge.model'
): GeneratedJavaFile[] {
  return classes.map((cls) => generateSingleJavaFile(cls, classes, relationships, defaultPackage));
}

export function generateSingleJavaFile(
  cls: UMLClassData,
  allClasses: UMLClassData[],
  relationships: UMLRelationshipData[],
  defaultPackage: string = 'com.umlforge.model'
): GeneratedJavaFile {
  const packageName = cls.packageName || defaultPackage;
  const fileName = `${cls.name}.java`;
  
  // Find outgoing relationships
  const outgoingRels = relationships.filter((r) => r.source === cls.id);
  const incomingRels = relationships.filter((r) => r.target === cls.id);

  // Determine superclass and interfaces from relationships and direct fields
  let extendsClass = cls.extendsClass;
  const implementsInterfaces = new Set<string>(cls.implementsInterfaces || []);

  for (const rel of outgoingRels) {
    const targetClass = allClasses.find((c) => c.id === rel.target);
    if (!targetClass) continue;

    if (rel.type === 'inheritance') {
      if (cls.stereotype === 'interface') {
        implementsInterfaces.add(targetClass.name); // in interface inheritance
      } else {
        extendsClass = targetClass.name;
      }
    } else if (rel.type === 'realization') {
      implementsInterfaces.add(targetClass.name);
    }
  }

  // Also check if any incoming inheritance if target is interface/class
  // Collect imports needed
  const imports = new Set<string>();
  
  // Track relationship-based fields
  interface InferredField {
    name: string;
    type: string;
    isCollection: boolean;
    targetClassName: string;
    relationshipType: string;
    doc: string;
  }
  const inferredFields: InferredField[] = [];

  for (const rel of outgoingRels) {
    const targetClass = allClasses.find((c) => c.id === rel.target);
    if (!targetClass) continue;

    if (['composition', 'aggregation', 'association'].includes(rel.type)) {
      const isMany = rel.targetMultiplicity?.includes('*');
      const baseName = rel.targetRole || lowercaseFirst(targetClass.name);
      const fieldName = isMany ? (baseName.endsWith('s') ? baseName : `${baseName}List`) : baseName;
      const fieldType = isMany ? `List<${targetClass.name}>` : targetClass.name;
      
      // Check if not already explicitly defined in attributes
      const alreadyExists = cls.attributes.some((a) => a.name.toLowerCase() === fieldName.toLowerCase());
      if (!alreadyExists) {
        inferredFields.push({
          name: fieldName,
          type: fieldType,
          isCollection: !!isMany,
          targetClassName: targetClass.name,
          relationshipType: rel.type,
          doc: `Represented via UML ${rel.type} relationship to {@link ${targetClass.name}}`,
        });
      }
    }
  }

  // Detect imports
  const scanTypeForImports = (typeStr: string) => {
    if (!typeStr) return;
    if (typeStr.includes('List') || typeStr.includes('ArrayList')) {
      imports.add('java.util.List');
      imports.add('java.util.ArrayList');
    }
    if (typeStr.includes('Set') || typeStr.includes('HashSet')) {
      imports.add('java.util.Set');
      imports.add('java.util.HashSet');
    }
    if (typeStr.includes('Map') || typeStr.includes('HashMap')) {
      imports.add('java.util.Map');
      imports.add('java.util.HashMap');
    }
    if (typeStr.includes('Optional')) imports.add('java.util.Optional');
    if (typeStr.includes('UUID')) imports.add('java.util.UUID');
    if (typeStr.includes('LocalDate')) imports.add('java.time.LocalDate');
    if (typeStr.includes('LocalDateTime')) imports.add('java.time.LocalDateTime');
    if (typeStr.includes('BigDecimal')) imports.add('java.math.BigDecimal');
    if (typeStr.includes('BigInteger')) imports.add('java.math.BigInteger');
    if (typeStr.includes('Queue')) imports.add('java.util.Queue');
    if (typeStr.includes('Deque')) imports.add('java.util.Deque');
    if (typeStr.includes('Objects')) imports.add('java.util.Objects');
  };

  cls.attributes.forEach((attr) => scanTypeForImports(attr.type));
  inferredFields.forEach((field) => scanTypeForImports(field.type));
  cls.methods.forEach((m) => {
    scanTypeForImports(m.returnType);
    m.parameters.forEach((p) => scanTypeForImports(p.type));
  });

  const lines: string[] = [];

  // 1. Package statement
  lines.push(`package ${packageName};`);
  lines.push('');

  // 2. Imports
  if (imports.size > 0) {
    const sortedImports = Array.from(imports).sort();
    sortedImports.forEach((imp) => lines.push(`import ${imp};`));
    lines.push('');
  }

  // 3. Javadoc
  lines.push('/**');
  lines.push(` * ${cls.docComment || `Represents the ${cls.name} ${cls.stereotype}.`}`);
  lines.push(' * Generated by UMLForge Visual Architect.');
  lines.push(' */');

  // 4. Class Header
  const classHeader = buildClassHeader(cls, extendsClass, Array.from(implementsInterfaces));
  lines.push(classHeader + ' {');

  // If Enum
  if (cls.stereotype === 'enum') {
    const enumValues = cls.enumValues && cls.enumValues.length > 0
      ? cls.enumValues.join(', ') + ';'
      : 'DEFAULT_VALUE;';
    lines.push(`    ${enumValues}`);
    lines.push('');
  }

  // 5. Attributes / Fields
  if (cls.stereotype !== 'record') {
    // Explicit attributes
    if (cls.attributes.length > 0) {
      cls.attributes.forEach((attr) => {
        if (attr.docComment) {
          lines.push(`    /** ${attr.docComment} */`);
        }
        const visibility = attr.visibility === 'package' ? '' : `${attr.visibility} `;
        const staticModifier = attr.isStatic ? 'static ' : '';
        const finalModifier = attr.isFinal ? 'final ' : '';
        const defaultVal = attr.defaultValue ? ` = ${attr.defaultValue}` : '';
        lines.push(`    ${visibility}${staticModifier}${finalModifier}${attr.type} ${attr.name}${defaultVal};`);
      });
      lines.push('');
    }

    // Inferred relationship fields
    if (inferredFields.length > 0) {
      lines.push('    // --- UML Relationship References ---');
      inferredFields.forEach((field) => {
        lines.push(`    /** ${field.doc} */`);
        if (field.isCollection) {
          lines.push(`    private ${field.type} ${field.name} = new ArrayList<>();`);
        } else {
          lines.push(`    private ${field.type} ${field.name};`);
        }
      });
      lines.push('');
    }

    // 6. Constructors
    if (cls.stereotype === 'class' || cls.stereotype === 'abstract') {
      // Default No-args Constructor
      lines.push(`    /** Default constructor */`);
      lines.push(`    public ${cls.name}() {`);
      lines.push('    }');
      lines.push('');

      // Parameterized Constructor (if attributes exist)
      const allFieldsForCtor = [
        ...cls.attributes.filter((a) => !a.isStatic),
      ];

      if (allFieldsForCtor.length > 0) {
        lines.push(`    /** Parameterized constructor */`);
        const paramsList = allFieldsForCtor.map((a) => `${a.type} ${a.name}`).join(', ');
        lines.push(`    public ${cls.name}(${paramsList}) {`);
        allFieldsForCtor.forEach((a) => {
          lines.push(`        this.${a.name} = ${a.name};`);
        });
        lines.push('    }');
        lines.push('');
      }
    }
  }

  // 7. Methods
  if (cls.methods.length > 0) {
    cls.methods.forEach((method) => {
      lines.push(buildMethodCode(cls, method));
      lines.push('');
    });
  }

  // 8. Getters and Setters (for regular classes)
  if (cls.stereotype === 'class') {
    const allGettableFields = [
      ...cls.attributes.map((a) => ({ name: a.name, type: a.type, isFinal: a.isFinal })),
      ...inferredFields.map((f) => ({ name: f.name, type: f.type, isFinal: false })),
    ];

    if (allGettableFields.length > 0) {
      lines.push('    // --- Getters & Setters ---');
      allGettableFields.forEach((f) => {
        const capitalized = capitalizeFirst(f.name);
        const getterPrefix = f.type.toLowerCase() === 'boolean' ? 'is' : 'get';
        
        // Getter
        lines.push(`    public ${f.type} ${getterPrefix}${capitalized}() {`);
        lines.push(`        return this.${f.name};`);
        lines.push('    }');
        lines.push('');

        // Setter (if not final)
        if (!f.isFinal) {
          lines.push(`    public void set${capitalized}(${f.type} ${f.name}) {`);
          lines.push(`        this.${f.name} = ${f.name};`);
          lines.push('    }');
          lines.push('');
        }
      });
    }
  }

  // 9. ToString Helper
  if (cls.stereotype === 'class') {
    const fieldNames = cls.attributes.map((a) => `${a.name}=' + ${a.name} + '`).join(', ');
    lines.push('    @Override');
    lines.push('    public String toString() {');
    lines.push(`        return "${cls.name}{" +`);
    if (fieldNames) {
      lines.push(`                "${fieldNames}" +`);
    }
    lines.push(`                '}';`);
    lines.push('    }');
  }

  lines.push('}');
  return {
    fileName,
    className: cls.name,
    packageName,
    code: lines.join('\n'),
    isInterface: cls.stereotype === 'interface',
    isEnum: cls.stereotype === 'enum',
    isRecord: cls.stereotype === 'record',
    isAbstract: cls.stereotype === 'abstract',
  };
}

function buildClassHeader(
  cls: UMLClassData,
  extendsClass?: string,
  implementsInterfaces: string[] = []
): string {
  let declaration = 'public ';

  switch (cls.stereotype) {
    case 'interface':
      declaration += `interface ${cls.name}`;
      if (implementsInterfaces.length > 0) {
        declaration += ` extends ${implementsInterfaces.join(', ')}`;
      }
      break;
    case 'abstract':
      declaration += `abstract class ${cls.name}`;
      if (extendsClass) declaration += ` extends ${extendsClass}`;
      if (implementsInterfaces.length > 0) {
        declaration += ` implements ${implementsInterfaces.join(', ')}`;
      }
      break;
    case 'enum':
      declaration += `enum ${cls.name}`;
      if (implementsInterfaces.length > 0) {
        declaration += ` implements ${implementsInterfaces.join(', ')}`;
      }
      break;
    case 'record': {
      const recordParams = cls.attributes.map((a) => `${a.type} ${a.name}`).join(', ');
      declaration += `record ${cls.name}(${recordParams})`;
      if (implementsInterfaces.length > 0) {
        declaration += ` implements ${implementsInterfaces.join(', ')}`;
      }
      break;
    }
    case 'class':
    default:
      declaration += `class ${cls.name}`;
      if (extendsClass) declaration += ` extends ${extendsClass}`;
      if (implementsInterfaces.length > 0) {
        declaration += ` implements ${implementsInterfaces.join(', ')}`;
      }
      break;
  }

  return declaration;
}

function buildMethodCode(cls: UMLClassData, method: UMLMethod): string {
  const lines: string[] = [];
  
  if (method.docComment) {
    lines.push(`    /** ${method.docComment} */`);
  }

  const isInterface = cls.stereotype === 'interface';
  const visibility = method.visibility === 'package' ? '' : `${method.visibility} `;
  const staticMod = method.isStatic ? 'static ' : '';
  const abstractMod = (method.isAbstract && !isInterface) ? 'abstract ' : '';
  const defaultMod = (method.isDefault && isInterface) ? 'default ' : '';
  
  const params = method.parameters.map((p) => `${p.type} ${p.name}`).join(', ');
  const signature = `    ${visibility}${staticMod}${abstractMod}${defaultMod}${method.returnType} ${method.name}(${params})`;

  if (isInterface && !method.isDefault && !method.isStatic) {
    lines.push(`${signature};`);
    return lines.join('\n');
  }

  if (method.isAbstract && !isInterface) {
    lines.push(`${signature};`);
    return lines.join('\n');
  }

  lines.push(`${signature} {`);
  if (method.customBody) {
    method.customBody.split('\n').forEach((bLine) => {
      lines.push(`        ${bLine}`);
    });
  } else {
    // Sensible default returns
    const retType = method.returnType.trim();
    if (retType === 'void') {
      lines.push('        // Implementation logic');
    } else if (retType === 'boolean') {
      lines.push('        return false;');
    } else if (['int', 'long', 'short', 'byte'].includes(retType)) {
      lines.push('        return 0;');
    } else if (['double', 'float'].includes(retType)) {
      lines.push('        return 0.0;');
    } else if (retType.endsWith('[]')) {
      const base = retType.slice(0, -2);
      lines.push(`        return new ${base}[0];`);
    } else if (retType.startsWith('List') || retType.startsWith('ArrayList')) {
      lines.push('        return new ArrayList<>();');
    } else if (retType.startsWith('Set') || retType.startsWith('HashSet')) {
      lines.push('        return new HashSet<>();');
    } else if (retType.startsWith('Map') || retType.startsWith('HashMap')) {
      lines.push('        return new HashMap<>();');
    } else if (retType.startsWith('Optional')) {
      lines.push('        return Optional.empty();');
    } else {
      lines.push('        return null;');
    }
  }
  lines.push('    }');

  return lines.join('\n');
}

function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowercaseFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}
