import { CommonProps } from '../common';

import { SFC, SVGAttributes } from 'react';

declare module '@elastic/eui' {

  /**
   * icon type defs
   *
   * @see './icon.js'
   */
  export type IconType =
    | 'addDataApp'
    | 'advancedSettingsApp'
    | 'alert'
    | 'apmApp'
    | 'apmTrace'
    | 'apps'
    | 'arrowDown'
    | 'arrowLeft'
    | 'arrowRight'
    | 'arrowUp'
    | 'asterisk'
    | 'bolt'
    | 'boxesHorizontal'
    | 'boxesVertical'
    | 'broom'
    | 'brush'
    | 'bullseye'
    | 'calendar'
    | 'check'
    | 'checkInCircleFilled'
    | 'clock'
    | 'compute'
    | 'console'
    | 'consoleApp'
    | 'controlsHorizontal'
    | 'controlsVertical'
    | 'copy'
    | 'copyClipboard'
    | 'createAdvancedJob'
    | 'createMultiMetricJob'
    | 'createPopulationJob'
    | 'createSingleMetricJob'
    | 'cross'
    | 'dashboardApp'
    | 'database'
    | 'dataVisualizer'
    | 'devToolsApp'
    | 'discoverApp'
    | 'document'
    | 'dot'
    | 'editorAlignCenter'
    | 'editorAlignLeft'
    | 'editorAlignRight'
    | 'editorBold'
    | 'editorCodeBlock'
    | 'editorComment'
    | 'editorHeading'
    | 'editorItalic'
    | 'editorLink'
    | 'editorOrderedList'
    | 'editorStrike'
    | 'editorTable'
    | 'editorUnderline'
    | 'editorUnorderedList'
    | 'empty'
    | 'exit'
    | 'expand'
    | 'exportAction'
    | 'eye'
    | 'eyeClosed'
    | 'faceHappy'
    | 'faceNeutral'
    | 'faceSad'
    | 'filter'
    | 'fullScreen'
    | 'gear'
    | 'glob'
    | 'grab'
    | 'graphApp'
    | 'grid'
    | 'grokApp'
    | 'heatmap'
    | 'help'
    | 'iInCircle'
    | 'importAction'
    | 'indexClose'
    | 'indexEdit'
    | 'indexFlush'
    | 'indexManagementApp'
    | 'indexMapping'
    | 'indexOpen'
    | 'indexPatternApp'
    | 'indexSettings'
    | 'infraApp'
    | 'inputOutput'
    | 'inspect'
    | 'invert'
    | 'kqlField'
    | 'kqlFunction'
    | 'kqlOperand'
    | 'kqlSelector'
    | 'kqlValue'
    | 'link'
    | 'list'
    | 'listAdd'
    | 'lock'
    | 'lockOpen'
    | 'loggingApp'
    | 'logoAerospike'
    | 'logoApache'
    | 'logoAWS'
    | 'logoAWSMono'
    | 'logoBeats'
    | 'logoCeph'
    | 'logoCloud'
    | 'logoCouchbase'
    | 'logoDocker'
    | 'logoDropwizard'
    | 'logoElastic'
    | 'logoElasticsearch'
    | 'logoElasticStack'
    | 'logoEtcd'
    | 'logoGCP'
    | 'logoGCPMono'
    | 'logoGithub'
    | 'logoGmail'
    | 'logoGolang'
    | 'logoHAproxy'
    | 'logoKafka'
    | 'logoKibana'
    | 'logoKubernetes'
    | 'logoKubernetes'
    | 'logoLogstash'
    | 'logoMemcached'
    | 'logoMongodb'
    | 'logoMySQL'
    | 'logoNginx'
    | 'logoOsquery'
    | 'logoPhp'
    | 'logoPostgres'
    | 'logoPrometheus'
    | 'logoRabbitmq'
    | 'logoRedis'
    | 'logoSketch'
    | 'logoSlack'
    | 'logoWebhook'
    | 'logoXpack'
    | 'logstashFilter'
    | 'logstashIf'
    | 'logstashInput'
    | 'logstashOutput'
    | 'logstashQueue'
    | 'machineLearningApp'
    | 'managementApp'
    | 'mapMarker'
    | 'memory'
    | 'merge'
    | 'minusInCircle'
    | 'monitoringApp'
    | 'node'
    | 'number'
    | 'pause'
    | 'pencil'
    | 'pin'
    | 'pipelineApp'
    | 'play'
    | 'plusInCircle'
    | 'popout'
    | 'questionInCircle'
    | 'refresh'
    | 'reportingApp'
    | 'save'
    | 'savedObjectsApp'
    | 'scale'
    | 'search'
    | 'searchProfilerApp'
    | 'securityApp'
    | 'shard'
    | 'share'
    | 'sortDown'
    | 'sortLeft'
    | 'sortRight'
    | 'sortUp'
    | 'spacesApp'
    | 'starEmpty'
    | 'starPlusFilled'
    | 'stats'
    | 'stop'
    | 'stopFilled'
    | 'storage'
    | 'string'
    | 'tableOfContents'
    | 'tag'
    | 'tear'
    | 'temperature'
    | 'timelionApp'
    | 'trash'
    | 'upgradeAssistantApp'
    | 'user'
    | 'usersRolesApp'
    | 'vector'
    | 'visArea'
    | 'visBarHorizontal'
    | 'visBarVertical'
    | 'visControls'
    | 'visGauge'
    | 'visGoal'
    | 'visHeatmap'
    | 'visLine'
    | 'visMapCoordinate'
    | 'visMapRegion'
    | 'visMetric'
    | 'visPie'
    | 'visTable'
    | 'visTagCloud'
    | 'visText'
    | 'visTimelion'
    | 'visualizeApp'
    | 'visVega'
    | 'visVisualBuilder'
    | 'watchesApp'
    | 'wrench'
    | 'auditbeatApp'
    | 'canvasApp'
    | 'crossClusterReplicationApp'
    | 'filebeatApp'
    | 'gisApp'
    | 'heartbeatApp'
    | 'indexRollupApp'
    | 'metricbeatApp'
    | 'notebookApp'
    | 'packetbeatApp'
    | 'securityAnalyticsApp'
    | 'sqlApp'

  export type IconSize = 'original' | 's' | 'm' | 'l' | 'xl' | 'xxl';

  export type IconColor =
    | 'accent'
    | 'danger'
    | 'default'
    | 'ghost'
    | 'primary'
    | 'secondary'
    | 'subdued'
    | 'success'
    | 'text'
    | 'warning'
    | string;

  export interface EuiIconProps {
    type?: IconType;
    color?: IconColor;
    size?: IconSize;
  }

  export const EuiIcon: SFC<CommonProps & SVGAttributes<SVGAElement> & EuiIconProps>;
}
