export type Visibility = 'public' | 'private' | 'protected' | 'package';

export type Stereotype = 'class' | 'abstract' | 'interface' | 'enum' | 'record';

export interface UMLAttribute {
  id: string;
  name: string;
  type: string;
  visibility: Visibility;
  isStatic?: boolean;
  isFinal?: boolean;
  defaultValue?: string;
  docComment?: string;
}

export interface UMLParameter {
  id: string;
  name: string;
  type: string;
}

export interface UMLMethod {
  id: string;
  name: string;
  returnType: string;
  parameters: UMLParameter[];
  visibility: Visibility;
  isStatic?: boolean;
  isAbstract?: boolean;
  isDefault?: boolean;
  docComment?: string;
  customBody?: string;
}

export interface UMLClassData {
  id: string;
  name: string;
  stereotype: Stereotype;
  packageName?: string;
  docComment?: string;
  attributes: UMLAttribute[];
  methods: UMLMethod[];
  enumValues?: string[];
  extendsClass?: string;
  implementsInterfaces?: string[];
}

export type RelationshipType = 
  | 'inheritance' 
  | 'realization' 
  | 'composition' 
  | 'aggregation' 
  | 'association' 
  | 'dependency';

export interface UMLRelationshipData {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  sourceRole?: string;
  targetRole?: string;
}

export interface DiagramProject {
  id: string;
  name: string;
  packageName: string;
  classes: UMLClassData[];
  relationships: UMLRelationshipData[];
  positions?: Record<string, { x: number; y: number }>;
}

export const COMMON_TYPES = [
  'void',
  'String',
  'int',
  'long',
  'double',
  'float',
  'boolean',
  'char',
  'byte',
  'UUID',
  'LocalDate',
  'LocalDateTime',
  'BigDecimal',
  'List<String>',
  'List<Object>',
  'Set<String>',
  'Map<String, Object>',
  'Optional<String>',
  'Object',
];

export const VISIBILITY_SYMBOLS: Record<Visibility, string> = {
  public: '+',
  private: '-',
  protected: '#',
  package: '~',
};

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: 'public (+)',
  private: 'private (-)',
  protected: 'protected (#)',
  package: 'package (~)',
};

export const RELATIONSHIP_LABELS: Record<RelationshipType, { name: string; desc: string; javaHint: string }> = {
  inheritance: {
    name: 'Generalization / Inheritance',
    desc: 'IS-A relationship with solid line & hollow triangle (extends)',
    javaHint: 'extends SuperClass',
  },
  realization: {
    name: 'Realization / Interface Implementation',
    desc: 'Contract fulfillment with dashed line & hollow triangle (implements)',
    javaHint: 'implements InterfaceName',
  },
  composition: {
    name: 'Composition',
    desc: 'Strong ownership with filled diamond at whole (deleted together)',
    javaHint: 'Field instance initialized & managed by parent',
  },
  aggregation: {
    name: 'Aggregation',
    desc: 'Weak ownership with hollow diamond at container (shared lifecycle)',
    javaHint: 'Field reference passed via constructor or setter',
  },
  association: {
    name: 'Association',
    desc: 'Structural relationship / link between classes (has-a / references)',
    javaHint: 'Field reference to target class',
  },
  dependency: {
    name: 'Dependency',
    desc: 'Transient usage with dashed open arrow (uses / method parameter / returns)',
    javaHint: 'Method parameter, local variable, or return type',
  },
};
